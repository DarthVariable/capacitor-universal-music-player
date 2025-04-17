import { registerPlugin } from '@capacitor/core';

import type { UniversalMusicPlayerPlugin } from './definitions';

const UniversalMusicPlayer = registerPlugin<UniversalMusicPlayerPlugin>('UniversalMusicPlayer', {
  web: () => import('./web').then((m) => new m.UniversalMusicPlayerWeb()),
});

export * from './definitions';
export { UniversalMusicPlayer };
