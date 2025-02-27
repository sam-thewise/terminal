<script lang="ts">
  import Ps1 from './Ps1.svelte';
  import Input from './Input.svelte';
  import History from './History.svelte';
  import { theme } from '../stores/theme';
</script>

<main
  class="h-full border-2 rounded-md p-4 overflow-auto text-xs sm:text-sm md:text-base"
  style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.green};`}
>
  <History />

  <div class="flex flex-col md:flex-row">
    <Ps1 />

    <Input />
  </div>
</main>

