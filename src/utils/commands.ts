import packageJson from '../../package.json';
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme } from '../stores/theme';
import { access } from '../stores/access';
import programs from '../../programs.json';
import type { Program } from '../interfaces/program';
import { sharedState } from '../states/shared.svelte';
import { CurrentGameState } from '../interfaces/sharedState';

const hostname = window.location.hostname;

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => 'Available commands: ' + Object.keys(commands).join(', '),
  hostname: () => hostname,
  whoami: () => 'guest',
  date: () => new Date().toLocaleString(),
  echo: (args: string[]) => args.join(' '),
  sudo: (args: string[]) => {
    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  publicprograms: () => {
    return `There are no public programs available.
a4ff1`;
  },
  program: (args: string[]) => {
    const defaultProgram: Program = programs.find((p) => p.name === 'a4ff1')!;
    const currentGameState = JSON.parse( localStorage.getItem('programs') || JSON.stringify(defaultProgram) );

    if (currentGameState && currentGameState.hasAccess) {
      if (args[0] && args[0] === 'run') {

        sharedState.currentGameState = CurrentGameState.PROGRAM;

        return 'Preparing to run program...';
      } else {
        return `${currentGameState.name}: ${currentGameState.description}
Commands available: run`;
      }
    }

    return 'Access denied.';
  },
  open: ( args: string[] ) => {
    if (args.length === 0) {
      return 'No program provided.';
    }

    const url = args[0];

    const accessProgram = programs.find((p) => p.name === url);

    if (accessProgram) {
      accessProgram.hasAccess = true;
      access.set(accessProgram);

      return `Access to program ${url} granted.`;
    } else {
      return `Access to program ${url} not found.`;
    }
  },
  clear: () => {
    history.set([]);

    return '';
  },
  exit: () => {
    return 'Please close the tab to exit.';
  },
  curl: async (args: string[]) => {
    if (args.length === 0) {
      return 'curl: no URL provided';
    }

    const url = args[0];

    try {
      const response = await fetch(url);
      const data = await response.text();

      return data;
    } catch (error) {
      return `curl: could not fetch URL ${url}. Details: ${error}`;
    }
  },
  banner: () => `                    
████████████████   ████████████████████            ███████████████████         
███████████████     ██████████████████████         ███████████████████████     
   █████████          █████████   █████████           █████████   █████████    
   █████████          █████████    █████████          █████████    █████████   
   █████████          █████████    █████████          █████████    █████████   
   █████████          █████████    ████████           █████████    ████████    
   █████████          █████████  █████████            ███████████████████      
   █████████          █████████████████               █████████████████████    
   █████████          ███████████████████             █████████    ███████████ 
   █████████          █████████ ██████████            █████████      █████████ 
   █████████          █████████  ██████████           █████████      █████████ 
   █████████          █████████   ██████████          █████████      █████████ 
   █████████          █████████    ██████████         █████████    ███████████ 
███████████████    ██████████████    ███████████   ████████████████████████    
████████████████   ███████████████    ███████████  ███████████████████         

Intelligence Review Bureau

All channels are secured and access is limited to authorized personnel only.

Welcome to the IRB Terminal. Type 'help' to see list of available commands.

`,
};
