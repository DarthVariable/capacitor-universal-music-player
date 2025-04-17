import { UniversalMusicPlayer } from 'capacitor-universal-music-player';

// Get DOM elements
const urlInput = document.getElementById('urlInput') as HTMLInputElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const currentTimeText = document.getElementById('currentTime') as HTMLSpanElement;
const durationText = document.getElementById('duration') as HTMLSpanElement;

// Track player state
let isNewTrack = true;
let currentUrl: string | null = null;

// Initialize buttons
function setInitialButtonStates() {
  playBtn.textContent = 'Play';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  isNewTrack = true;
}

function setPlayingButtonStates() {
  playBtn.textContent = 'Resume';
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  stopBtn.disabled = false;
}

function setPausedButtonStates() {
  playBtn.textContent = 'Resume';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = false;
}

function setStoppedButtonStates() {
  playBtn.textContent = 'Play';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  isNewTrack = true;
}

// Set initial states
setInitialButtonStates();

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
  } catch (error) {
    console.error('Error stopping:', error);
    statusText.textContent = 'Error stopping';
  }
});

// Set up progress listener
UniversalMusicPlayer.onProgress((data) => {
  currentTimeText.textContent = data.currentTime.toFixed(2);
  durationText.textContent = data.duration.toFixed(2);
});

// Periodically check playing status
setInterval(async () => {
  try {
    const { playing } = await UniversalMusicPlayer.isPlaying();
    if (!playing && statusText.textContent === 'Playing') {
      statusText.textContent = 'Stopped';
      setStoppedButtonStates();
      currentUrl = null;
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }
}, 1000); 