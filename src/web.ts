import { WebPlugin } from '@capacitor/core';

import type { UniversalMusicPlayerPlugin } from './definitions';

export class UniversalMusicPlayerWeb extends WebPlugin implements UniversalMusicPlayerPlugin {
  private audio: HTMLAudioElement | null = null;
  private progressCallback: ((data: { currentTime: number; duration: number }) => void) | null = null;
  private currentUrl: string | null = null;

  async play(options: { url: string }): Promise<void> {
    try {
      if (!this.audio) {
        this.audio = new Audio();
        this.audio.preload = 'auto';
        
        // Add error handling
        this.audio.onerror = (e) => {
          console.error('Audio error:', this.audio?.error);
          throw new Error(`Failed to load audio: ${this.audio?.error?.message || 'Unknown error'}`);
        };

        // Add loading event listeners
        this.audio.addEventListener('loadstart', () => console.log('Audio loading started'));
        this.audio.addEventListener('loadeddata', () => console.log('Audio data loaded'));
        this.audio.addEventListener('canplay', () => console.log('Audio can play'));
        
        this.audio.addEventListener('timeupdate', () => {
          if (this.progressCallback && this.audio) {
            this.progressCallback({
              currentTime: this.audio.currentTime,
              duration: this.audio.duration,
            });
          }
        });
      }

      // Only reload if it's a new URL
      if (this.currentUrl !== options.url) {
        this.audio.pause();
        this.audio.src = '';
        this.audio.load();
        console.log('Setting audio source:', options.url);
        this.audio.crossOrigin = 'anonymous';
        this.audio.src = options.url;
        this.currentUrl = options.url;
        await this.audio.load();
      }

      await this.audio.play();
    } catch (error) {
      console.error('Error in play method:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.audio) {
      await this.audio.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.audio) {
      await this.audio.play();
    }
  }

  async stop(): Promise<void> {
    if (this.audio) {
      await this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.currentUrl = null;
      await this.audio.load();
    }
  }

  async isPlaying(): Promise<{ playing: boolean }> {
    return { playing: !!this.audio && !this.audio.paused };
  }

  async getCurrentTime(): Promise<{ seconds: number }> {
    return { seconds: this.audio?.currentTime ?? 0 };
  }

  async getDuration(): Promise<{ seconds: number }> {
    return { seconds: this.audio?.duration ?? 0 };
  }

  async seekTo(options: { seconds: number }): Promise<void> {
    if (this.audio) {
      this.audio.currentTime = options.seconds;
    }
  }

  async loop(options: { enabled: boolean }): Promise<void> {
    if (this.audio) {
      this.audio.loop = options.enabled;
    }
  }

  onProgress(callback: (data: { currentTime: number; duration: number }) => void): void {
    this.progressCallback = callback;
  }
}
