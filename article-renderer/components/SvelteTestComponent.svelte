<!-- components/Counter.svelte -->
<script lang="ts">
  export let initialValue: number = 0;

  let count = initialValue;
  $: isInitialValue = count === initialValue;

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);
  const reset = () => (count = initialValue);
</script>

<div>
  <span>{count}</span>

  <button type="button" on:click={decrement}>-</button>
  <button type="button" on:click={increment}>+</button>
  <button type="button" on:click={reset} disabled={isInitialValue}>Reset</button>
</div>

<svelte:options customElement="svelte-counter" />