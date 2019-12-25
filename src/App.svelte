<script>
  const electron = require("electron").remote;
  import Router from "svelte-spa-router";
  import { tweened } from "svelte/motion";
  import { quadOut } from "svelte/easing";

  import Dashboard from "./pages/Dashboard.svelte";

  const visible = tweened(0, {
    duration: 250,
    easing: quadOut
  });
  const routes = {
    "/": Dashboard
  };

  electron.getCurrentWindow().on("show", () => {
    visible.set(1);
  });
  electron.getCurrentWindow().on("animateHidden", () => {
    visible.set(0);
    setTimeout(() => {
      electron.getCurrentWindow().hide();
    }, 250);
  });
</script>

<style>
  #app {
    display: flex;
    background: var(--color-first);
    flex: 1;
    margin: 1rem 2rem 2rem;
    position: relative;
    border-radius: 0.5rem;
    box-shadow: 0 0.1rem 2rem rgba(0, 0, 0, 0.2);
  }
  #app::before {
    content: "";
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid var(--color-first);
    position: absolute;
    top: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
</style>

<div
  id="app"
  style="transform: translateY({10 - $visible * 10}px); opacity: {$visible}">
  <Router {routes} />
</div>
