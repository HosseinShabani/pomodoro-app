import { writable } from "svelte/store";

function createStore() {
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
      status: ["pomo", "short", "long"][0],
      remainTime: 25 * 60
    },
    days: []
  });

  const change = (newData = {}) => {
    update(prevData => {
      return { ...prevData, ...newData };
    });
  };

  return {
    subscribe,
    changeConfig: (key, value) => {
      update(prevData => {
        return {
          ...prevData,
          configs: {
            ...prevData.configs,
            [key]: value
          }
        };
      });
    }
  };
}

export const store = createStore();
