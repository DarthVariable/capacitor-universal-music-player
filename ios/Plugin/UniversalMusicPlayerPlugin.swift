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
        guard let url = call.getString("url") else {
            call.reject("Must provide a URL")
            return
        }
        implementation.play(url: url)
        call.resolve()
    }

    @objc func pause(_ call: CAPPluginCall) {
        implementation.pause()
        call.resolve()
    }

    @objc func resume(_ call: CAPPluginCall) {
        implementation.resume()
        call.resolve()
    }

    @objc func stop(_ call: CAPPluginCall) {
        implementation.stop()
        call.resolve()
    }

    @objc func isPlaying(_ call: CAPPluginCall) {
        let playing = implementation.isPlaying()
        call.resolve(["playing": playing])
    }

    @objc func getCurrentTime(_ call: CAPPluginCall) {
        let time = implementation.getCurrentTime()
        call.resolve(["seconds": time])
    }

    @objc func getDuration(_ call: CAPPluginCall) {
        let duration = implementation.getDuration()
        call.resolve(["seconds": duration])
    }

    @objc func seekTo(_ call: CAPPluginCall) {
        guard let seconds = call.getDouble("seconds") else {
            call.reject("Must provide seconds")
            return
        }
        implementation.seekTo(seconds: seconds)
        call.resolve()
    }

    @objc func loop(_ call: CAPPluginCall) {
        guard let shouldLoop = call.getBool("shouldLoop") else {
            call.reject("Must provide shouldLoop boolean")
            return
        }
        implementation.loop(shouldLoop: shouldLoop)
        call.resolve()
    }

    @objc func onProgress(_ call: CAPPluginCall) {
        implementation.onProgress { [weak self] currentTime, duration in
            self?.notifyListeners("progress", data: [
                "currentTime": currentTime,
                "duration": duration
            ])
        }
        call.resolve()
    }
} 