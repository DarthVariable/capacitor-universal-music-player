import { WebPlugin } from '@capacitor/core';

import type { UniversalMusicPlayerPlugin } from './definitions';

export class UniversalMusicPlayerWeb extends WebPlugin implements UniversalMusicPlayerPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
