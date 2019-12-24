<script>
  import { onMount } from "svelte";
  const { ipcRenderer } = require("electron");

  let time = 120;

  onMount(() => {
    const timer = setInterval(() => {
      time--;
      ipcRenderer.send(
        "setTrayTitle",
        `${Math.floor(time / 60)} : ${Math.floor(time % 60)}`
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });
</script>

<style>
  .dashboardPage {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>

<div class="dashboardPage">
  <p>{Math.floor(time / 60)} : {Math.floor(time % 60)}</p>
  <button>
    <i class="icon-pause" />
  </button>
</div>
