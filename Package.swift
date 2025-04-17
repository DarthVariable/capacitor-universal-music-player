// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorUniversalMusicPlayer",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapacitorUniversalMusicPlayer",
            targets: ["UniversalMusicPlayerPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "UniversalMusicPlayerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/UniversalMusicPlayerPlugin"),
        .testTarget(
            name: "UniversalMusicPlayerPluginTests",
            dependencies: ["UniversalMusicPlayerPlugin"],
            path: "ios/Tests/UniversalMusicPlayerPluginTests")
    ]
)