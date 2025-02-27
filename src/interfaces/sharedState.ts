import type { SoundEffect } from './soundEffect';

export interface SharedState {
  currentGameState: CurrentGameState;
  aforenLoadedSounds: SoundEffect[];
  aforenState: AforenState;
  aforenTalkLines: string[];
  aforenCurrentLine: string;
  aforenCurrentLineIndex: number;
  aforenHasReadAllLines: boolean;
  aforenCurrentLineWordsLength: number;
}

export enum AforenState {
  IDLE = 'idle',
  TALKING = 'talking',
}

export enum CurrentGameState {
  CONSOLE = 'console',
  PROGRAM = 'program',
  WORLD = 'world',
}
