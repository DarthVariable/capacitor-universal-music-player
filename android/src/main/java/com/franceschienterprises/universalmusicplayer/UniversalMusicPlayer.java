package com.franceschienterprises.universalmusicplayer;

import android.content.Context;
import android.net.Uri;
import androidx.media3.common.MediaItem;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

public class UniversalMusicPlayer {

    private ExoPlayer player;
    private Context context;
    private Handler progressHandler;
    private Runnable progressRunnable;
    private ProgressUpdateListener progressUpdateListener;
    private static final String TAG = "UniversalMusicPlayer";

    public interface ProgressUpdateListener {
        void onProgressUpdate(long currentTime, long duration);
    }

    public UniversalMusicPlayer(Context context) {
        this.context = context;
        initializePlayer();
    }

    private void initializePlayer() {
        if (player == null) {
            player = new ExoPlayer.Builder(context).build();
            // Add any necessary listeners here, e.g., for state changes
            player.addListener(new Player.Listener() {
                @Override
                public void onPlaybackStateChanged(int playbackState) {
                    if (playbackState == Player.STATE_ENDED) {
                         Log.d(TAG, "Playback ended");
                         stopProgressUpdates(); // Stop updates when finished
                    }
                }
            });
            Log.d(TAG, "ExoPlayer initialized");
        }
    }

    public void play(String url) {
        initializePlayer();
        Uri uri = Uri.parse(url);
        MediaItem mediaItem = MediaItem.fromUri(uri);
        player.setMediaItem(mediaItem);
        player.prepare();
        player.play();
        Log.d(TAG, "Playing: " + url);
        startProgressUpdates();
    }

    public void pause() {
        if (player != null && player.isPlaying()) {
            player.pause();
            Log.d(TAG, "Paused");
            stopProgressUpdates();
        }
    }

    public void resume() {
        if (player != null && !player.isPlaying()) {
            player.play();
            Log.d(TAG, "Resumed");
            startProgressUpdates();
        }
    }

    public void stop() {
        if (player != null) {
            player.stop();
            player.seekTo(0);
            Log.d(TAG, "Stopped");
            stopProgressUpdates();
        }
    }

    public boolean isPlaying() {
         return player != null && player.isPlaying();
    }

    public long getCurrentTime() {
        return player != null ? player.getCurrentPosition() : 0;
    }

    public long getDuration() {
         // Return 0 if duration is unavailable (e.g., live stream or not loaded)
        long duration = player != null ? player.getDuration() : 0;
        return duration >= 0 ? duration : 0;
    }

    public void seekTo(long milliseconds) {
        if (player != null) {
            player.seekTo(milliseconds);
            Log.d(TAG, "Seeked to: " + milliseconds);
            // If seeking while paused, might need to manually trigger one update
             if (!player.isPlaying() && progressUpdateListener != null) {
                  progressUpdateListener.onProgressUpdate(player.getCurrentPosition(), getDuration()); // Use getDuration() here
            }
        }
    }

    public void loop(boolean shouldLoop) {
        if (player != null) {
            player.setRepeatMode(shouldLoop ? Player.REPEAT_MODE_ONE : Player.REPEAT_MODE_OFF);
             Log.d(TAG, "Looping set to: " + shouldLoop);
        }
    }

    public ExoPlayer getPlayer() {
        return player;
    }

    public void releasePlayer() {
        stopProgressUpdates();
        if (player != null) {
            player.release();
            player = null;
            Log.d(TAG, "Player released");
        }
    }

    public void setProgressUpdateListener(ProgressUpdateListener listener) {
        this.progressUpdateListener = listener;
    }

    private void startProgressUpdates() {
        if (progressHandler != null) return; // Already running

        progressHandler = new Handler(Looper.getMainLooper());
        progressRunnable = new Runnable() {
            @Override
            public void run() {
                if (player != null && player.isPlaying() && progressUpdateListener != null) {
                    progressUpdateListener.onProgressUpdate(getCurrentTime(), getDuration()); // Use getter methods
                    progressHandler.postDelayed(this, 1000); // Update every second
                } else {
                    stopProgressUpdates(); // Stop if player is not playing
                }
            }
        };
        progressHandler.post(progressRunnable);
        Log.d(TAG, "Started progress updates");
    }

    private void stopProgressUpdates() {
        if (progressHandler != null) {
            progressHandler.removeCallbacks(progressRunnable);
            progressHandler = null;
            progressRunnable = null;
            Log.d(TAG, "Stopped progress updates");
        }
    }
}
