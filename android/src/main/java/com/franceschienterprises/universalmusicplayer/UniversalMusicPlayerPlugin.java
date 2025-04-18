package com.franceschienterprises.universalmusicplayer;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "UniversalMusicPlayer")
public class UniversalMusicPlayerPlugin extends Plugin {

    private UniversalMusicPlayer implementation;

    @Override
    public void load() {
        implementation = new UniversalMusicPlayer(getContext());
    }

    @PluginMethod
    public void play(PluginCall call) {
        String url = call.getString("url");
        if (url == null) {
            call.reject("Must provide a URL");
            return;
        }
        getActivity().runOnUiThread(() -> {
            implementation.play(url);
            call.resolve();
        });
    }

    @PluginMethod
    public void pause(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            implementation.pause();
            call.resolve();
        });
    }

    @PluginMethod
    public void resume(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            implementation.resume();
            call.resolve();
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            implementation.stop();
            call.resolve();
        });
    }

    @PluginMethod
    public void isPlaying(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            boolean playing = implementation.isPlaying();
            JSObject ret = new JSObject();
            ret.put("playing", playing);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void getCurrentTime(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            long time = implementation.getCurrentTime();
            JSObject ret = new JSObject();
            // Convert milliseconds to seconds for consistency with web/iOS
            ret.put("seconds", (double) time / 1000.0);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void getDuration(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            long duration = implementation.getDuration();
            JSObject ret = new JSObject();
            // Convert milliseconds to seconds for consistency with web/iOS
            ret.put("seconds", (double) duration / 1000.0);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void seekTo(PluginCall call) {
        Double seconds = call.getDouble("seconds");
        if (seconds == null) {
            call.reject("Must provide seconds");
            return;
        }
        getActivity().runOnUiThread(() -> {
            // Convert seconds to milliseconds for ExoPlayer
            implementation.seekTo((long) (seconds * 1000));
            call.resolve();
        });
    }

    @PluginMethod
    public void loop(PluginCall call) {
        Boolean shouldLoop = call.getBoolean("enabled"); // Match web definition
        if (shouldLoop == null) {
            call.reject("Must provide enabled boolean");
            return;
        }
        getActivity().runOnUiThread(() -> {
            implementation.loop(shouldLoop);
            call.resolve();
        });
    }

    @PluginMethod
    public void onProgress(PluginCall call) {
        implementation.setProgressUpdateListener((currentTime, duration) -> {
            JSObject ret = new JSObject();
            // Convert milliseconds to seconds
            ret.put("currentTime", (double) currentTime / 1000.0);
            ret.put("duration", (double) duration / 1000.0);
            notifyListeners("progress", ret);
        });
        // Keep the call alive for continuous updates
        call.setKeepAlive(true);
        // We don't resolve this call immediately as it's for a listener
    }

    @Override
    protected void handleOnDestroy() {
        // Clean up the player when the activity is destroyed
        if (implementation != null) {
             getActivity().runOnUiThread(() -> {
                 implementation.releasePlayer();
             });
        }
        super.handleOnDestroy();
    }
}
