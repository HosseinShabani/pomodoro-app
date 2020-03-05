<script>
  import { onMount } from "svelte";

  import { Header } from "../components";
  import { store } from "../store";
  import { utils } from "../utils";

  let playSvg;
  let svgLength = 0;

  onMount(() => {
    svgLength = playSvg.getTotalLength();
  });
</script>

<style>
  .dashboardPage {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .timer {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .timer__status {
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    color: var(--color-third);
  }
  .timer__counter {
    display: flex;
    align-items: flex-end;
  }
  .timer__counter-time {
    font-size: 4.3rem;
    font-weight: 500;
    word-spacing: -0.2em;
    font-family: sans-serif;
    margin-left: 2rem;
  }
  .timer__counter-min {
    color: var(--color-third);
    font-size: 1rem;
    margin: 0.7rem 0;
    min-width: 2rem;
    text-align: right;
  }
  .timer__buttons {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }
  .playButton {
    width: 4.5rem;
    height: 4.5rem;
    position: relative;
    display: flex;
  }
  .playButton svg {
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    position: absolute;
    z-index: 1;
  }
  .playButton svg circle {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke: var(--color-second);
    fill: transparent;
  }
  .playButton button {
    display: flex;
    margin: 12%;
    background: var(--color-second);
    color: var(--color-primary);
    flex: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    z-index: 2;
  }
</style>

<div class="dashboardPage">
  <Header />
  <section class="timer">
    <p class="timer__status">
      {$store.app.status === 'pomodro' ? 'Working' : $store.app.status === 'shortBreak' ? 'Short Break' : 'Long Break'}
    </p>
    <div class="timer__counter">
      <p class="timer__counter-time">
        {utils.formatedDate($store.app.remainTime)}
      </p>
      <span class="timer__counter-min">min</span>
    </div>
    <div class="timer__buttons">
      <div class="playButton">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 200 200">
          <circle
            bind:this={playSvg}
            cx="100"
            cy="100"
            r="92"
            stroke-width="8"
            stroke-dasharray={svgLength}
            stroke-dashoffset={svgLength - ($store.app.remainTime * svgLength) / $store.app.maxTime} />
        </svg>
        <button on:click={store.toggleStart}>
          <i class={`icons icon-${$store.app.isCounting ? 'pause' : 'play'}`} />
        </button>
      </div>
    </div>
  </section>
</div>
