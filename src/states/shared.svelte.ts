
import type { SoundEffect } from '../interfaces/soundEffect';
import { type SharedState, AforenState, CurrentGameState } from '../interfaces/sharedState';

export const sharedState = $state({ 
  currentGameState: CurrentGameState.CONSOLE,
  aforenState: AforenState.IDLE,
  aforenLoadedSounds: [] as SoundEffect[],
  aforenTalkLines: [] as string[],
  aforenCurrentLine: '',
  aforenCurrentLineIndex: 0,
  aforenHasReadAllLines: false,
  aforenCurrentLineWordsLength: 0,
} as SharedState);