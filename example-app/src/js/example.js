import { UniversalMusicPlayer } from 'capacitor-universal-music-player';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    UniversalMusicPlayer.echo({ value: inputValue })
}
