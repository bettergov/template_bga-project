<script>
  import Dummy from "dummyjs";
  import { fade } from "svelte/transition";
  let visible = true;
</script>

<section class="story">
  {@html Dummy.html()}
</section>
