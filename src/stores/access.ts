import { writable } from 'svelte/store';
import programs from '../../programs.json';
import type { Program } from '../interfaces/program';

const defaultPrograms: Program = programs.find((p) => p.name === 'a4ff1')!;

export const access = writable<Program>(
  JSON.parse(
    localStorage.getItem('programs') || JSON.stringify(defaultPrograms),
  ),
);

access.subscribe((value) => {
  localStorage.setItem('programs', JSON.stringify(value));
});
  