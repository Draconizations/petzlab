<script lang="ts">
  import ViewPort from "$lib/components/view/ViewPort.svelte";

  let fuzzAmount = 0;
  let ballSize = 100;
</script>

<div class="row">
  <ViewPort {fuzzAmount} {ballSize} />
  <div class="col">
    <label for="fuzzAmount">Fuzz Amount</label>
    <input type="number" min={0} max={10} bind:value={fuzzAmount} id="fuzzAmount">
    <label for="ballSize">Ball Size</label>
    <input type="number" min={1} max={500} bind:value={ballSize} id="ballSize">
  </div>
</div>

<style>
  .row, .col {
    display: flex;
    flex-direction: column;
  }

  .row {
    gap: 0.5rem;
  }

  .col {
    padding: 0.5rem;
  }

  @media (min-width: 600px) {
    .row {
      flex-direction: row;
    }
  }
</style>