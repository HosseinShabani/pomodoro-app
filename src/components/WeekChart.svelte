<script>
  const electron = require("electron").remote;
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";

  const progress = tweened(0, {
    duration: 700,
    easing: cubicInOut
  });
  const days = [
    {
      name: "Monday",
      pomos: 4
    },
    {
      name: "Tuesday",
      pomos: 6
    },
    {
      name: "Wednesday",
      pomos: 3
    },
    {
      name: "Thursday",
      pomos: 5
    },
    {
      name: "Friday",
      pomos: 3
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
  let activeDay = "Friday";
  let biggestPomo = 0;

  days.forEach(day => {
    if (day.pomos > biggestPomo) biggestPomo = day.pomos;
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
    opacity: 0.6;
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
          style="height: {$progress * ((100 * day.pomos) / biggestPomo)}%" />
      </div>
      <p class="itemDay-day">{day.name.slice(0, 1)}</p>
    </div>
  {/each}
</div>
