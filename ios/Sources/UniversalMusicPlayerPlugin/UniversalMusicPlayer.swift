import Foundation
import AVFoundation
import Capacitor

@objc public class UniversalMusicPlayer: NSObject {
    var player: AVPlayer?
    var loopEnabled = false
    var timeObserverToken: Any?

    public func play(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"), let url = URL(string: urlString) else {
            call.reject("Invalid URL")
            return
        }

        let playerItem = AVPlayerItem(url: url)
        self.player = AVPlayer(playerItem: playerItem)

        if loopEnabled {
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(playerDidFinishPlaying),
                name: .AVPlayerItemDidPlayToEndTime,
                object: playerItem
            )
        }

        self.player?.play()
        call.resolve()
    }

    public func pause(_ call: CAPPluginCall) {
        self.player?.pause()
        call.resolve()
    }

    public func resume(_ call: CAPPluginCall) {
        self.player?.play()
        call.resolve()
    }

    public func stop(_ call: CAPPluginCall) {
        self.player?.pause()
        self.player?.seek(to: CMTime.zero)
        call.resolve()
    }

    public func isPlaying(_ call: CAPPluginCall) {
        let isPlaying = self.player?.rate != 0 && self.player?.error == nil
        call.resolve(["playing": isPlaying])
    }

    public func getCurrentTime(_ call: CAPPluginCall) {
        let time = self.player?.currentTime().seconds ?? 0
        call.resolve(["seconds": time])
    }

    public func getDuration(_ call: CAPPluginCall) {
        let duration = self.player?.currentItem?.duration.seconds ?? 0
        call.resolve(["seconds": duration])
    }

    public func seekTo(_ call: CAPPluginCall) {
        guard let seconds = call.getDouble("seconds") else {
            call.reject("Missing 'seconds'")
            return
        }

        let time = CMTime(seconds: seconds, preferredTimescale: 1)
        self.player?.seek(to: time)
        call.resolve()
    }

    public func loop(_ call: CAPPluginCall) {
        self.loopEnabled = call.getBool("enabled") ?? false
        call.resolve()
    }

    public func onProgress(_ call: CAPPluginCall) {
        let interval = CMTime(seconds: 1, preferredTimescale: CMTimeScale(NSEC_PER_SEC))

        if let token = timeObserverToken {
            self.player?.removeTimeObserver(token)
            timeObserverToken = nil
        }

        timeObserverToken = self.player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            guard let self = self else { return }
            let duration = self.player?.currentItem?.duration.seconds ?? 0

            NotificationCenter.default.post(
                name: Notification.Name("progress"),
                object: nil,
                userInfo: [
                    "currentTime": time.seconds,
                    "duration": duration
                ]
            )
        }

        call.resolve()
    }

    @objc private func playerDidFinishPlaying() {
        self.player?.seek(to: CMTime.zero)
        self.player?.play()
    }

    deinit {
        if let token = timeObserverToken {
            self.player?.removeTimeObserver(token)
        }
        NotificationCenter.default.removeObserver(self)
    }
}
