const { ipcRenderer } = require("electron");
import { writable } from "svelte/store";

import { utils } from "./utils";

function createStore() {
  let interval;
  const { subscribe, update } = writable({
    configs: {
      pomodro: 25,
      shortBreak: 5,
      longBreak: 10,
      longBreakAfter: 4,
      sound: true,
      autoStart: false
    },
    app: {
      round: 0,
      status: ["pomodro", "shortBreak", "longBreak"][0],
      remainTime: 25 * 60,
      maxTime: 25 * 60,
      isCounting: false,
      today: utils.today()
    },
    days: {
      "2020/03/04": 4,
      "2020/03/03": 2,
      "2020/03/01": 0,
      "2020/03/06": 6
    }
  });

  const configTimer = () => {
    update(prevData => {
      const { isCounting, remainTime, maxTime, status } = prevData.app;
      const time = prevData.configs[status] * 60;
      if (!isCounting && (remainTime === maxTime || remainTime === 0)) {
        prevData.app.remainTime = time;
        prevData.app.maxTime = time;
      }
      return prevData;
    });
  };

  const finishTimer = () => {
    clearInterval(interval);
    ipcRenderer.send("setTrayTitle", "");
    update(prevData => {
      const { longBreakAfter, sound } = prevData.configs;
      const { status, round } = prevData.app;
      if (status === "pomodro") {
        prevData.days[utils.today()] = round + 1;
        prevData.app.status =
          round + 1 >= longBreakAfter ? "longBreak" : "shortBreak";
        prevData.app.round += 1;
      } else prevData.app.status = "pomodro";
      prevData.app.isCounting = false;
      if (sound) {
        const notif = new Notification("Pomodro App", {
          body: "Your " + status + " has ended"
        });
        notif.onclick = () => ipcRenderer.send("show-window");
      }
      return prevData;
    });
    configTimer();
    update(prevData => {
      const { autoStart } = prevData.configs;
      if (autoStart) {
        prevData.app.isCounting = true;
        startTimer();
      }
      return prevData;
    });
  };

  const startTimer = () => {
    interval = setInterval(() => {
      let remainTime;
      update(prevData => {
        const { maxTime, status } = prevData.app;
        remainTime = prevData.app.remainTime;
        if (maxTime === remainTime && prevData.configs.sound) {
          const notif = new Notification("Pomodro App", {
            body: "Your " + status + " has started"
          });
          notif.onclick = () => ipcRenderer.send("show-window");
        }
        prevData.app.remainTime = remainTime - 1;
        ipcRenderer.send(
          "setTrayTitle",
          utils.formatedDate(prevData.app.remainTime)
        );
        return prevData;
      });
      if (remainTime === 1) finishTimer();
    }, 1000);
  };

  return {
    subscribe,
    changeConfig: (key, value) => {
      update(prevData => {
        prevData.configs[key] = value;
        configTimer();

        return prevData;
      });
    },
    toggleStart: () => {
      update(prevData => {
        const { isCounting } = prevData.app;
        ipcRenderer.send("setTrayTitle", "");
        if (!isCounting) startTimer();
        else clearInterval(interval);
        prevData.app.isCounting = !isCounting;
        return prevData;
      });
    },
    changeAppData: data => {
      update(prevData => {
        prevData = { ...prevData, ...data };
        prevData.app.isCounting = false;
        // if not today
        if (prevData.app.today !== utils.today()) {
          prevData.app = {
            isCounting: false,
            maxTime: 0,
            remainTime: 0,
            round: 0,
            status: "pomodro",
            today: utils.today()
          };
        }
        return prevData;
      });
      configTimer();
    }
  };
}

export const store = createStore();
