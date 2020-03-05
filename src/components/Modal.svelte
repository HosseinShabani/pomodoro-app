<script context="module">
  let openModal = () => false;
  let closeModal = () => false;

  export { openModal, closeModal };
</script>

<script>
  const { ipcRenderer } = require("electron");
  import { tweened } from "svelte/motion";
  import { expoOut } from "svelte/easing";

  import SettingsRow from "./SettingsRow.svelte";
  import { store } from "../store";

  const showTween = tweened(0, {
    duration: 350,
    easing: expoOut
  });
  const settings = [
    {
      id: 1,
      title: "Pomo duration",
      type: "number",
      key: "pomodro"
    },
    {
      id: 2,
      title: "Short Break duration",
      type: "number",
      key: "shortBreak"
    },
    {
      id: 3,
      title: "Long Break duration",
      type: "number",
      key: "longBreak"
    },
    {
      id: 4,
      title: "Long Break after",
      type: "number",
      key: "longBreakAfter"
    },
    {
      id: 5,
      title: "Sound",
      type: "switch",
      key: "sound"
    },
    {
      id: 6,
      title: "Auto Start",
      type: "switch",
      key: "autoStart"
    }
  ];
  let visible = false;
  let ModalComponent = null;

  openModal = () => {
    showTween.set(1);
    visible = true;
  };

  closeModal = () => {
    showTween.set(0);
    setTimeout(() => {
      visible = false;
    }, 300);
  };

  function handleChange(key, value) {
    store.changeConfig(key, value);
  }
</script>

<style>
  .modal {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  .modal__bg {
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    top: 0;
    right: 0;
  }
  .modal__content {
    display: flex;
    background: #fff;
    position: absolute;
    z-index: 2;
    border-radius: 0.5rem 0.5rem 0 0;
    overflow: hidden;
    width: 96%;
    height: 98%;
    flex-direction: column;
    bottom: 0;
    right: 2%;
    box-sizing: border-box;
    padding: 1.2rem;
  }
  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal__bottom {
    display: flex;
    flex-direction: column;
  }
  .modal__header h3 {
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--color-secondary);
  }
  .modal__close {
    padding: 0.3rem;
    font-size: 1.4rem;
    color: (--color-first);
  }
  .close_button {
    display: flex;
    height: 2rem;
    margin-top: 1rem;
    align-items: center;
    padding: 0;
  }
  .close_button p {
    color: var(--color-second);
    font-size: 1rem;
    font-weight: 500;
    color: rgb(180, 14, 14);
  }
</style>

{#if visible}
  <div class="modal">
    <div class="modal__bg" style="opacity: {$showTween}" />
    <div
      class="modal__content"
      style="transform:translateY({100 - $showTween * 100}%);opacity: {$showTween}">
      <header class="modal__header">
        <h3>Settings</h3>
        <button class="modal__close" on:click={closeModal}>
          <i class="icons icon-close" />
        </button>
      </header>
      <div class="modal__bottom">
        {#each settings as item (item.id)}
          <SettingsRow
            title={item.title}
            type={item.type}
            value={$store.configs[item.key]}
            on:change={({ detail }) => handleChange(item.key, detail)} />
        {/each}
        <button
          class="close_button"
          on:click={() => {
            ipcRenderer.send('closeApp');
          }}>
          <p>Close App</p>
        </button>
      </div>
    </div>
  </div>
{/if}
