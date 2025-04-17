export interface UniversalMusicPlayerPlugin {
  play(options: { url: string }): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  isPlaying(): Promise<{ playing: boolean }>;
  getCurrentTime(): Promise<{ seconds: number }>;
  getDuration(): Promise<{ seconds: number }>;
  seekTo(options: { seconds: number }): Promise<void>;
  loop(options: { enabled: boolean }): Promise<void>;
  onProgress(callback: (data: { currentTime: number; duration: number }) => void): void;
}
