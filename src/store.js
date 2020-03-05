import { writable } from "svelte/store";

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
      isCounting: false
    },
    days: []
  });

  const configTimer = () => {
    update(prevData => {
      const time = prevData.configs[prevData.app.status] * 60;
      prevData.app.remainTime = time;
      prevData.app.maxTime = time;
      return prevData;
    });
  };

  const finishTimer = () => {
    clearInterval(interval);
    update(prevData => {
      const { longBreakAfter, sound } = prevData.configs;
      const { status, round } = prevData.app;
      if (status === "pomodro") {
        prevData.app.status =
          round + 1 >= longBreakAfter ? "longBreak" : "shortBreak";
        prevData.app.round += 1;
      } else prevData.app.status = "pomodro";
      prevData.app.isCounting = false;
      if (sound)
        new Notification("Pomodro App", {
          body: "Your " + status + " has ended"
        });
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
          new Notification("Pomodro App", {
            body: "Your " + status + " has started"
          });
        }
        prevData.app.remainTime = remainTime - 1;
        return prevData;
      });
      if (remainTime === 1) finishTimer();
    }, 10);
  };

  return {
    subscribe,
    changeConfig: (key, value) => {
      update(prevData => {
        const { isCounting, remainTime, maxTime } = prevData.app;
        prevData.configs[key] = value;
        !isCounting && remainTime === maxTime && configTimer();
        return prevData;
      });
    },
    toggleStart: () => {
      update(prevData => {
        const { isCounting } = prevData.app;
        if (!isCounting) startTimer();
        else clearInterval(interval);
        prevData.app.isCounting = !isCounting;
        return prevData;
      });
    }
  };
}

export const store = createStore();
