import { WebPlugin } from '@capacitor/core';

import type { UniversalMusicPlayerPlugin } from './definitions';

export class UniversalMusicPlayerWeb extends WebPlugin implements UniversalMusicPlayerPlugin {
  private audio: HTMLAudioElement;
  private progressCallback?: (data: { currentTime: number; duration: number }) => void;
  private progressInterval?: number;

  constructor() {
    super();
    this.audio = new Audio();
    
    // Set up error handling
    this.audio.onerror = () => {
      console.error('Audio playback error');
    };
  }

  async play(options: { url: string }): Promise<void> {
    this.audio.src = options.url;
    await this.audio.play();
    this.startProgressTracking();
  }

  async pause(): Promise<void> {
    this.audio.pause();
  }

  async resume(): Promise<void> {
    await this.audio.play();
  }

  async stop(): Promise<void> {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.stopProgressTracking();
  }

  async isPlaying(): Promise<{ playing: boolean }> {
    return {
      playing: !this.audio.paused
    };
  }

  async getCurrentTime(): Promise<{ seconds: number }> {
    return {
      seconds: this.audio.currentTime
    };
  }

  async getDuration(): Promise<{ seconds: number }> {
    return {
      seconds: this.audio.duration || 0
    };
  }

  async seekTo(options: { seconds: number }): Promise<void> {
    this.audio.currentTime = options.seconds;
  }

  async loop(options: { enabled: boolean }): Promise<void> {
    this.audio.loop = options.enabled;
  }

  onProgress(callback: (data: { currentTime: number; duration: number }) => void): void {
    this.progressCallback = callback;
    this.startProgressTracking();
  }

  private startProgressTracking(): void {
    if (this.progressInterval) {
      return;
    }

    this.progressInterval = window.setInterval(() => {
      if (this.progressCallback && !this.audio.paused) {
        this.progressCallback({
          currentTime: this.audio.currentTime,
          duration: this.audio.duration || 0
        });
      }
    }, 1000);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      window.clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }
}
