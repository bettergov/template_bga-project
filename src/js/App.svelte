<script>
  import Dummy from "dummyjs";
  import { fade } from "svelte/transition";
  let visible = true;
</script>

<section class="story">
  {@html Dummy.html()}
</section>

<!-- <label>
  <input type="checkbox" bind:checked={visible} />
  visible
</label>

{#if visible}
  <p transition:fade>Fades in and out</p>
{/if} -->
