import Foundation
import Capacitor

@objc(UniversalMusicPlayerPlugin)
public class UniversalMusicPlayerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "UniversalMusicPlayerPlugin"
    public let jsName = "UniversalMusicPlayer"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "play", returnType: .none),
        CAPPluginMethod(name: "pause", returnType: .none),
        CAPPluginMethod(name: "resume", returnType: .none),
        CAPPluginMethod(name: "stop", returnType: .none),
        CAPPluginMethod(name: "isPlaying", returnType: .promise),
        CAPPluginMethod(name: "getCurrentTime", returnType: .promise),
        CAPPluginMethod(name: "getDuration", returnType: .promise),
        CAPPluginMethod(name: "seekTo", returnType: .none),
        CAPPluginMethod(name: "loop", returnType: .none),
        CAPPluginMethod(name: "onProgress", returnType: .none),
    ]

    private let implementation = UniversalMusicPlayer()

    @objc func play(_ call: CAPPluginCall) {
        implementation.play(call)
    }

    @objc func pause(_ call: CAPPluginCall) {
        implementation.pause(call)
    }

    @objc func resume(_ call: CAPPluginCall) {
        implementation.resume(call)
    }

    @objc func stop(_ call: CAPPluginCall) {
        implementation.stop(call)
    }

    @objc func isPlaying(_ call: CAPPluginCall) {
        implementation.isPlaying(call)
    }

    @objc func getCurrentTime(_ call: CAPPluginCall) {
        implementation.getCurrentTime(call)
    }

    @objc func getDuration(_ call: CAPPluginCall) {
        implementation.getDuration(call)
    }

    @objc func seekTo(_ call: CAPPluginCall) {
        implementation.seekTo(call)
    }

    @objc func loop(_ call: CAPPluginCall) {
        implementation.loop(call)
    }

    @objc func onProgress(_ call: CAPPluginCall) {
        implementation.onProgress(call)
    }
}
