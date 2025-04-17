export interface UniversalMusicPlayerPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
