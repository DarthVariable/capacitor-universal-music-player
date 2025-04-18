import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(UniversalMusicPlayerPlugin)
public class UniversalMusicPlayerPlugin: CAPPlugin {
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
        call.resolve(["seconds": time / 1000.0])
    }

    @objc func getDuration(_ call: CAPPluginCall) {
        let duration = implementation.getDuration()
        call.resolve(["seconds": duration / 1000.0])
    }

    @objc func seekTo(_ call: CAPPluginCall) {
        guard let seconds = call.getDouble("seconds") else {
            call.reject("Must provide seconds")
            return
        }
        implementation.seekTo(seconds: seconds * 1000)
        call.resolve()
    }

    @objc func loop(_ call: CAPPluginCall) {
        guard let shouldLoop = call.getBool("enabled") else {
            call.reject("Must provide enabled boolean")
            return
        }
        implementation.loop(shouldLoop: shouldLoop)
        call.resolve()
    }

    @objc func onProgress(_ call: CAPPluginCall) {
        implementation.setProgressUpdateListener { [weak self] currentTime, duration in
            let progressData: [String: Any] = [
                "currentTime": currentTime / 1000.0,
                "duration": duration / 1000.0
            ]
            self?.notifyListeners("progress", data: progressData)
        }
        call.keepAlive = true
    }

    // Optional: Add load() method if needed for specific initialization
    // public override func load() {
    //     // Initialization code here
    // }

    // Optional: Add handleOnDestroy() if specific cleanup beyond the
    // implementation's release is needed
    // deinit {
    //    // Perform cleanup if necessary, though implementation.releasePlayer()
    //    // in UniversalMusicPlayer should handle most things.
    // }
} 