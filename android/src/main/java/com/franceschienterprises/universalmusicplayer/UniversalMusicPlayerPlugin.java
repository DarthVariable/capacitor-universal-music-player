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
            call.reject("Missing 'url'");
            return;
        }
        implementation.play(url, call);
    }

    @PluginMethod
    public void pause(PluginCall call) {
        implementation.pause(call);
    }

    @PluginMethod
    public void resume(PluginCall call) {
        implementation.resume(call);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        implementation.stop(call);
    }

    @PluginMethod
    public void isPlaying(PluginCall call) {
        implementation.isPlaying(call);
    }

    @PluginMethod
    public void getCurrentTime(PluginCall call) {
        implementation.getCurrentTime(call);
    }

    @PluginMethod
    public void getDuration(PluginCall call) {
        implementation.getDuration(call);
    }

    @PluginMethod
    public void seekTo(PluginCall call) {
        Double seconds = call.getDouble("seconds");
        if (seconds == null) {
            call.reject("Missing 'seconds'");
            return;
        }
        implementation.seekTo(seconds, call);
    }

    @PluginMethod
    public void loop(PluginCall call) {
        Boolean enabled = call.getBoolean("enabled", false);
        implementation.loop(enabled, call);
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        implementation.release();
    }
}
