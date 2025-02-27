<script lang="ts">

  import { sharedState } from '../states/shared.svelte';
  import { AforenState } from '../interfaces/sharedState';
  import { SoundType, type SoundEffect } from '../interfaces/soundEffect';

  let hasLoadedSounds = $state(false);
  let loadedSoundCount = 0;

  let hasLoadedImages = $state(false);
  let loadedImagesCount = 0;

  let isBlinking = $state(false);

  let isPlayingTalkingSound = $state(false);

  //can be HTMLAudioElement or null
  let currentlyPlayingSound = $state(null) as HTMLAudioElement | null;

  if (sharedState.aforenLoadedSounds.length === 0) {
    //preload the sounds from the /sound/talk1.mp3 to /sound/talk15.mp3, store their time length and reference in the sharedState
    for (let soundIdx = 0; soundIdx < 15; soundIdx++) {
      const filename = `/sound/talk${soundIdx + 1}.mp3`;
      const sound = new Audio(filename);

      sound.load();

      //wait for the load metadata to finish, then get the length in time
      sound.addEventListener('loadedmetadata', () => {
        sharedState.aforenLoadedSounds.push({
          soundElement: sound,
          duration: sound.duration * 1000,
          filename: filename,
          soundType: SoundType.TALK
        });

        loadedSoundCount++;

        if ( loadedSoundCount === 16 ) {
          hasLoadedSounds = true;
        }
      });
    }

    const blinkFileName = '/sound/blink.wav';
    const blinkSound = new Audio(blinkFileName);

    blinkSound.load();

    blinkSound.addEventListener('loadedmetadata', () => {
      sharedState.aforenLoadedSounds.push({
        soundElement: blinkSound,
        duration: blinkSound.duration * 1000,
        filename: blinkFileName,
        soundType: SoundType.BLINK
      });

      loadedSoundCount++;

      if ( loadedSoundCount === 16 ) {
        hasLoadedSounds = true;
      }
    });
  } else {
    hasLoadedSounds = true;
  }

  //preload images
  const images = ['/img/aforen-idle.png', '/img/aforen-blink.png', '/img/aforen-talk.png'];

  images.forEach((image) => {
    const img = new Image();
    img.src = image;

    img.onload = () => {
      loadedImagesCount++;

      if (loadedImagesCount === images.length) {
        hasLoadedImages = true;
      }
    };
  });

  //create a function to blink the eyes random every 3-5 seconds
  const blink = () => {
    isBlinking = true;

    if (hasLoadedSounds) {
      const blinkSound = sharedState.aforenLoadedSounds.find((sound) => sound.soundType === SoundType.BLINK);
      if( blinkSound ) {
        //set volume to 0.1
        blinkSound.soundElement.volume = 0.2;
        blinkSound.soundElement.play();
      }
    }

    setTimeout(() => {
      
      isBlinking = false;
    }, 300);
  };

  setInterval(blink, Math.floor(Math.random() * 2000) + 4000);

  $effect(() => {
    if (sharedState.aforenState === AforenState.TALKING && !isPlayingTalkingSound) {
      const talkingSounds = sharedState.aforenLoadedSounds.filter((sound) => sound.soundType === SoundType.TALK);
      if (talkingSounds.length > 0) {
        //get a random sound from the array
        const randomSound = talkingSounds[Math.floor(Math.random() * talkingSounds.length)];

        //bind to the sound element event when it ends
        randomSound.soundElement.onended = () => {
          isPlayingTalkingSound = false;
          randomSound.soundElement.onended = null;
          currentlyPlayingSound = null;
        };

        randomSound.soundElement.volume = 0.5;
        randomSound.soundElement.play();

        currentlyPlayingSound = randomSound.soundElement;

        isPlayingTalkingSound = true;
      }
    }

    if (sharedState.aforenState === AforenState.IDLE && isPlayingTalkingSound) {
      currentlyPlayingSound?.pause();
      isPlayingTalkingSound = false;
      currentlyPlayingSound = null;
    }
  });
</script>

{#if hasLoadedSounds && hasLoadedImages}
<div class="container">
  <div class="animation">
    <div class="creature-container">
      <img src="/img/aforen-idle.png" alt="Aforen" class="creature" />
    </div>
    <div class="blink-container">
      <img src="/img/aforen-blink.png" alt="Blink" class="blink {isBlinking ? 'blinking' : '' }" />
    </div>
    <div class="talk-container">
      <img src="/img/aforen-talk.png" alt="Talk" class="talk {sharedState.aforenState === AforenState.TALKING ? 'talking' : ''}" />
    </div>
  </div>
</div>
{:else}
  <div class="container load">
    <div>Loading...</div>
  </div>
{/if}

<style lang="css">
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    /* make sure the container is never larger than 30% of the screen vertically */
  }

  .animation{
    position: relative;
    width: 100%;
    height: 100%;
    animation: idle-breath 3s infinite;
  }

  .container.load {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .creature-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .creature {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .blink-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .blink {
    width: 100%;
    height: 100%;
    opacity: 0;
    object-fit: contain;
  }

  .blink.blinking {
    opacity: 1;
  }

  .talk-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .talk {
    width: 100%;
    height: 100%;
    opacity: 0;
    object-fit: contain;
  }

  .talking {
    animation: talk 0.5s infinite;
  }

  @keyframes blink {
    0%, 95% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes idle-breath {
    0%, 100% {
      transform-origin: center bottom;
      transform: scaleY(1);
    }
    50% {
      transform-origin: center bottom;
      transform: scaleY(0.985);
    }
  }

  @keyframes talk {
    0%, 90% {
      opacity: 0;
    }
    20%, 80% {
      opacity: 1;
    }
  }


</style>

