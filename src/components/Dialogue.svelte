<script lang="ts">
    import Creature from "./Creature.svelte";
    import { sharedState } from '../states/shared.svelte';
    import { AforenState } from '../interfaces/sharedState';
    import { CurrentGameState } from '../interfaces/sharedState';
    import { theme } from '../stores/theme';

    import introLines from '../data/intro.json';

    sharedState.aforenTalkLines = introLines;
    sharedState.aforenCurrentLineIndex = 0;
    sharedState.aforenCurrentLine = sharedState.aforenTalkLines[sharedState.aforenCurrentLineIndex];
    sharedState.aforenCurrentLineWordsLength = sharedState.aforenCurrentLine.split(' ').length;

    sharedState.aforenState = AforenState.TALKING;

    let hasIntroFinished = $state(false);

    const handleClick = () => {
      //clear current timeout
      clearTimeout(currentTimeout);

      dialogueProgress();
    }

    const dialogueProgress = () => {
      if (sharedState.aforenState === AforenState.TALKING) {
          if (sharedState.aforenCurrentLineIndex < sharedState.aforenTalkLines.length - 1) {
            sharedState.aforenCurrentLineIndex++;
            sharedState.aforenCurrentLine = sharedState.aforenTalkLines[sharedState.aforenCurrentLineIndex];
            sharedState.aforenCurrentLineWordsLength = sharedState.aforenCurrentLine.split(' ').length;

            currentTimeout = setTimeout(() => {
              dialogueProgress();
            }, sharedState.aforenCurrentLineWordsLength * 500);
          } else {
            sharedState.aforenState = AforenState.IDLE;
            hasIntroFinished = true;
          }
        }
      };


    let currentTimeout = $state(
      setTimeout(() => {
        //automatically progress the dialogue
        dialogueProgress();
      },
      sharedState.aforenCurrentLineWordsLength * 500
    ));

    
</script>

<div class="container">
  <div class="creature">
    <Creature />
  </div>
  <div class="text-container">
    <button class="text-box" onclick={handleClick} onkeydown={(e) => e.key === 'Enter' && handleClick()}>
      <p>{sharedState.aforenCurrentLine}</p>
    </button>
  </div>
  <div class="button-container">
    {#if hasIntroFinished}
      <button onclick={() => sharedState.currentGameState = CurrentGameState.WORLD} style={`color: ${$theme.green}`}>
        <p>Continue</p>
      </button>  
    {/if}
  </div>
</div>

<style lang="css">
  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      max-height: 100%;

      /* items should display in rows down the page */
      flex-direction: column;
  }

  .container .creature {
      height: 100%;
      max-height: 30%;
      width: 100%;

      border: 2px solid #fff;
      border-radius: 3px;

      background: #fff;
  }

  .text-box {
    border: 1px solid #fff;
    border-radius: 3px;
    padding: 3rem;
    min-height: 120px;
    margin-top: 3rem;
  }

  .text-box p {
    overflow: hidden;
  }

  .button-container {
    margin-top: 1rem;
    min-height: 100px;
  }

  .button-container button {
    border: 1px solid #fff;
    border-radius: 3px;
    padding: 1rem;
  }
</style>