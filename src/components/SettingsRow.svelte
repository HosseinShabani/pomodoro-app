<script>
  import { createEventDispatcher } from "svelte";
  import Checkbox from "svelte-checkbox";

  const dispatch = createEventDispatcher();
  export let title,
    type = "number",
    value = "";

  const handleChange = () => {
    dispatch("change", type === "number" ? value * 1 : value);
  };
</script>

<style>
  .settingsRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    min-height: 2rem;
  }
  .settingsRow__title {
    color: var(--color-second);
    font-size: 1rem;
  }
  .settingsRow__input {
    width: 4.3rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: var(--color-fourth);
    font-size: 0.9rem;
    box-sizing: border-box;
    padding: 0.3rem 0.6rem;
  }
</style>

<div class="settingsRow">
  <p class="settingsRow__title">{title}</p>
  {#if type === 'number'}
    <input
      type="number"
      class="settingsRow__input"
      bind:value
      on:change={handleChange} />
  {:else if type === 'switch'}
    <Checkbox
      size="1.9rem"
      secondaryColor="rgba(22, 20, 119, 0.15)"
      bind:checked={value}
      on:change={handleChange} />
  {/if}
</div>
