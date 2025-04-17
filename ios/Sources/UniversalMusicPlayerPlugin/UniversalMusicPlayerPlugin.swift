import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(UniversalMusicPlayerPlugin)
public class UniversalMusicPlayerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "UniversalMusicPlayerPlugin"
    public let jsName = "UniversalMusicPlayer"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = UniversalMusicPlayer()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
}
