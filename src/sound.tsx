import { Audio } from "expo-av";
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";


export default class Sounds {
    sounds: {[key: string]: {object: Audio.Sound, path: string, isPlaying: boolean}};
  
    constructor() {
      this.sounds = {}
      this.load_sounds()
    }

    register(soundName: string, path: string) {
      this.sounds[soundName] = {
        object: new Audio.Sound(),
        path: path,
        isPlaying: false,
      }
    }

    load_sounds = async () => {
      this.register("피싱", "../assets/피싱.wav")
      this.register("쉭", "../assets/쉭.wav")
      this.register("undertale_change_color", "../assets/undertale_change_color.wav")
      this.register("sans_voice", "../assets/sans_voice.wav")
      this.register("바람", "../assets/[효과음]바람1.mp3")
      this.register("먹기", "../assets/[효과음]먹기1.mp3")

      await this.sounds["피싱"].object.loadAsync(require("../assets/피싱.wav"));
      await this.sounds["쉭"].object.loadAsync(require("../assets/쉭.wav"));
      await this.sounds["undertale_change_color"].object.loadAsync(require("../assets/undertale_change_color.wav"));
      await this.sounds["sans_voice"].object.loadAsync(require("../assets/sans_voice.wav"));
      await this.sounds["바람"].object.loadAsync(require("../assets/[효과음]바람1.mp3"));
      await this.sounds["먹기"].object.loadAsync(require("../assets/[효과음]먹기1.mp3"));
    }

    play = async (sound: string) => {
      await this.sounds[sound].object.replayAsync();
    };
}