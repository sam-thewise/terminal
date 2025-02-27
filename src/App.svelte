<script lang="ts">
  import Console from './components/Console.svelte';

  import { sharedState } from './states/shared.svelte';

  import { CurrentGameState } from './interfaces/sharedState';

  import Dialogue from './components/Dialogue.svelte';

  //preload /sounds/bg-calm.mp3
  let bgMusic = $state( new Audio('/sound/bg-calm.mp3') );
  bgMusic.loop = true;
  bgMusic.load();

  let isMusicLoaded = $state(false);

  let isMusicPlaying = $state(false);

  bgMusic.addEventListener('loadedmetadata', () => {
    isMusicLoaded = true;
  });

  $effect(() => {
    console.log('currentGameState changed', sharedState.currentGameState, isMusicLoaded);
    if (sharedState.currentGameState === CurrentGameState.CONSOLE) {
      bgMusic.pause();
    } else if (isMusicLoaded && !isMusicPlaying) {
      console.log('playing music');
      bgMusic.currentTime = 0;
      bgMusic.play();
      isMusicPlaying = true;
    }
  });
</script>
<svelte:head>
  {#if import.meta.env.VITE_TRACKING_ENABLED === 'true'}
    <script
      async
      defer
      data-website-id={import.meta.env.VITE_TRACKING_SITE_ID}
      src={import.meta.env.VITE_TRACKING_URL}
    ></script>
  {/if}
</svelte:head>

{#if sharedState.currentGameState === CurrentGameState.CONSOLE}
  <Console />
{:else}
  <div class="h-screen flex items-center justify-center">
    {#if isMusicLoaded}
    <Dialogue />
    {:else}
    <div class="text-center">
      <p>Loading...</p>
    </div>
    {/if}
  </div>
{/if}
