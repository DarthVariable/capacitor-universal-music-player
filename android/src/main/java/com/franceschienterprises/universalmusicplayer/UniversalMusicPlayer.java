package com.franceschienterprises.universalmusicplayer;

import android.content.Context;
import android.net.Uri;

import com.getcapacitor.PluginCall;
import com.google.common.util.concurrent.ListenableFuture;

import androidx.media3.common.MediaItem;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;

public class UniversalMusicPlayer {
    private final ExoPlayer player;

    public UniversalMusicPlayer(Context context) {
        player = new ExoPlayer.Builder(context).build();
    }

    public void play(String url, PluginCall call) {
        MediaItem mediaItem = MediaItem.fromUri(Uri.parse(url));
        player.setMediaItem(mediaItem);
        player.prepare();
        player.play();
        call.resolve();
    }

    public void pause(PluginCall call) {
        player.pause();
        call.resolve();
    }

    public void resume(PluginCall call) {
        player.play();
        call.resolve();
    }

    public void stop(PluginCall call) {
        player.pause();
        player.seekTo(0);
        call.resolve();
    }

    public void isPlaying(PluginCall call) {
        call.resolve(JSObjectHelper.create("playing", player.isPlaying()));
    }

    public void getCurrentTime(PluginCall call) {
        call.resolve(JSObjectHelper.create("seconds", player.getCurrentPosition() / 1000.0));
    }

    public void getDuration(PluginCall call) {
        call.resolve(JSObjectHelper.create("seconds", player.getDuration() / 1000.0));
    }

    public void seekTo(double seconds, PluginCall call) {
        player.seekTo((long) (seconds * 1000));
        call.resolve();
    }

    public void loop(boolean enabled, PluginCall call) {
        player.setRepeatMode(enabled ? Player.REPEAT_MODE_ONE : Player.REPEAT_MODE_OFF);
        call.resolve();
    }

    public ExoPlayer getPlayer() {
        return player;
    }

    public void release() {
        player.release();
    }
}
