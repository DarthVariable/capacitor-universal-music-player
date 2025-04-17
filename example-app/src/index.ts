import { UniversalMusicPlayer } from 'capacitor-universal-music-player';

// Get DOM elements
const urlInput = document.getElementById('urlInput') as HTMLInputElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const currentTimeText = document.getElementById('currentTime') as HTMLSpanElement;
const durationText = document.getElementById('duration') as HTMLSpanElement;
const seekSlider = document.getElementById('seekSlider') as HTMLInputElement;

// Get icon elements
const playIcon = playBtn.querySelector('i') as HTMLElement;

// Track player state
let isNewTrack = true;
let currentUrl: string | null = null;
let isDraggingSlider = false;
let currentDuration = 0;

// Format time in seconds to MM:SS
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize buttons
function setInitialButtonStates() {
  playIcon.className = 'fas fa-play';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  seekSlider.value = '0';
  seekSlider.disabled = true;
  isNewTrack = true;
}

function setPlayingButtonStates() {
  playIcon.className = 'fas fa-play';
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  stopBtn.disabled = false;
  seekSlider.disabled = false;
}

function setPausedButtonStates() {
  playIcon.className = 'fas fa-play';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = false;
  seekSlider.disabled = false;
}

function setStoppedButtonStates() {
  playIcon.className = 'fas fa-play';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  seekSlider.value = '0';
  seekSlider.disabled = true;
  isNewTrack = true;
}

// Set initial states
setInitialButtonStates();

// Handle slider events
seekSlider.addEventListener('mousedown', () => {
  isDraggingSlider = true;
});

seekSlider.addEventListener('mouseup', async () => {
  isDraggingSlider = false;
  if (currentDuration > 0) {
    const seekTime = (parseFloat(seekSlider.value) / 100) * currentDuration;
    await UniversalMusicPlayer.seekTo({ seconds: seekTime });
  }
});

seekSlider.addEventListener('input', () => {
  if (currentDuration > 0) {
    const seekTime = (parseFloat(seekSlider.value) / 100) * currentDuration;
    currentTimeText.textContent = formatTime(seekTime);
  }
});

// Set up event listeners
playBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  
  if (isNewTrack) {
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }
    currentUrl = url;
  }

  try {
    statusText.textContent = isNewTrack ? 'Loading...' : 'Resuming...';
    console.log(isNewTrack ? 'Attempting to play:' : 'Resuming:', currentUrl);
    
    if (isNewTrack) {
      await UniversalMusicPlayer.play({ url: currentUrl! });
    } else {
      await UniversalMusicPlayer.resume();
    }
    
    console.log('Playback started successfully');
    statusText.textContent = 'Playing';
    setPlayingButtonStates();
    isNewTrack = false;
  } catch (error) {
    console.error('Error playing:', error);
    statusText.textContent = `Error: ${error.message || 'Failed to play audio'}`;
    setInitialButtonStates();
  }
});

pauseBtn.addEventListener('click', async () => {
  try {
    await UniversalMusicPlayer.pause();
    statusText.textContent = 'Paused';
    setPausedButtonStates();
  } catch (error) {
    console.error('Error pausing:', error);
    statusText.textContent = 'Error pausing';
  }
});

stopBtn.addEventListener('click', async () => {
  try {
    await UniversalMusicPlayer.stop();
    statusText.textContent = 'Stopped';
    setStoppedButtonStates();
    currentUrl = null;
    currentDuration = 0;
    currentTimeText.textContent = '0:00';
    durationText.textContent = '0:00';
  } catch (error) {
    console.error('Error stopping:', error);
    statusText.textContent = 'Error stopping';
  }
});

// Set up progress listener
UniversalMusicPlayer.onProgress((data) => {
  currentDuration = data.duration;
  if (!isDraggingSlider) {
    const progress = (data.currentTime / data.duration) * 100;
    seekSlider.value = progress.toString();
    currentTimeText.textContent = formatTime(data.currentTime);
    durationText.textContent = formatTime(data.duration);
  }
});

// Periodically check playing status
setInterval(async () => {
  try {
    const { playing } = await UniversalMusicPlayer.isPlaying();
    if (!playing && statusText.textContent === 'Playing') {
      statusText.textContent = 'Stopped';
      setStoppedButtonStates();
      currentUrl = null;
      currentDuration = 0;
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }
}, 1000); 