export interface SoundEffect {
  filename: string;
  soundElement: HTMLAudioElement;
  duration: number;
  soundType: SoundType;
}

export enum SoundType {
  TALK = 'talk',
  BLINK = 'blink'
}