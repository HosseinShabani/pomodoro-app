<script>
  const electron = require("electron").remote;
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import dayjs from "dayjs";

  import { store } from "../store";
  import { utils } from "../utils";

  const progress = tweened(0, {
    duration: 700,
    easing: cubicInOut
  });
  let days = [
    {
      name: "Monday",
      pomos: 0
    },
    {
      name: "Tuesday",
      pomos: 0
    },
    {
      name: "Wednesday",
      pomos: 0
    },
    {
      name: "Thursday",
      pomos: 0
    },
    {
      name: "Friday",
      pomos: 0
    },
    {
      name: "Saturday",
      pomos: 0
    },
    {
      name: "Sunday",
      pomos: 0
    }
  ];
  const activeDay = dayjs().format("dddd");
  const activeDayIndex = days.indexOf(
    days.find(item => item.name === activeDay)
  );
  let biggestPomo = 0;
  let allZero = true;
  store.subscribe(data => {
    days = days.map((item, i) => {
      item.pomos =
        data.days[
          dayjs(utils.today())
            .add(i - activeDayIndex, "day")
            .format("YYYY/MM/DD")
        ] || 0;
      return item;
    });
    days.forEach(day => {
      if (day.pomos > biggestPomo) biggestPomo = day.pomos;
      if (allZero) allZero = day.pomos === 0;
    });
  });

  electron.getCurrentWindow().on("show", () => {
    progress.set(1);
  });
</script>

<style>
  .weekChart {
    display: flex;
    margin-top: 1.5rem;
    height: 20vh;
  }
  .itemDay {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    align-items: center;
    color: var(--color-first);
  }
  .itemDay-day {
    font-weight: 500;
    font-size: 0.9rem;
  }
  .itemDay-pomos {
    font-family: sans-serif;
    font-size: 0.9rem;
    opacity: 0.6;
  }
  .itemDay__bar {
    width: 0.4rem;
    display: flex;
    flex: 1;
    margin: 0.6rem 0;
    opacity: 0.4;
    position: relative;
  }
  .itemDay-pomos.active,
  .itemDay__bar.active {
    opacity: 1;
  }
  .itemDay__bar .-bar {
    width: 100%;
    height: 0%;
    background: var(--color-primary);
    border-radius: 1rem;
    position: absolute;
    bottom: 0;
  }
</style>

<div class="weekChart">
  {#each days as day}
    <div class="itemDay">
      <span class:active={activeDay === day.name} class="itemDay-pomos">
        {day.pomos || ''}
      </span>
      <div class:active={activeDay === day.name} class="itemDay__bar">
        <div
          class="-bar"
          style="height: {$progress * (allZero ? 100 : (100 * day.pomos) / biggestPomo)}%" />
      </div>
      <p class="itemDay-day">{day.name.slice(0, 1)}</p>
    </div>
  {/each}
</div>
