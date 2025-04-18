#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(UniversalMusicPlayerPlugin, "UniversalMusicPlayer",
           CAP_PLUGIN_METHOD(play, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(pause, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(resume, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(stop, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(isPlaying, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCurrentTime, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getDuration, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(seekTo, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(loop, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(onProgress, CAPPluginReturnCallback);
) 