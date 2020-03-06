<script>
  import { WeekChart, openModal } from ".";
  import dayjs from "dayjs";

  const openSettingModal = () => {
    openModal();
  };
</script>

<style>
  .header {
    display: flex;
    flex-direction: column;
    margin: 0.6rem;
    border-radius: 0.6rem;
    background: var(--color-secondary);
    padding: 1rem;
  }
  .header__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .header__top-left {
    display: flex;
    flex-direction: column;
    color: var(--color-first);
  }
  .header__top-left h2 {
    font-weight: 500;
    font-size: 1.1rem;
    line-height: 1.4em;
  }
  .header__top-left span {
    opacity: 0.4;
    font-size: 0.85rem;
  }
  .header__top-right {
    display: flex;
    align-items: center;
  }
  .settingsButton {
    color: var(--color-first);
    padding: 0.3rem;
    font-size: 1.3rem;
  }
</style>

<header class="header">
  <div class="header__top">
    <div class="header__top-left">
      <h2>Pomodoro App</h2>
      <span>{dayjs().format('dddd , MMM D')}</span>
    </div>
    <div class="header__top-right">
      <button class="settingsButton" on:click={openSettingModal}>
        <i class="icons icon-settings" />
      </button>
    </div>
  </div>
  <WeekChart />
</header>
