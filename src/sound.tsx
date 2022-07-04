import { Audio } from "expo-av";


export default class Sounds {
    sounds: {[key: string]: Audio.Sound};
  
    constructor() {
      this.sounds = {}
      this.load_sounds()
    }

    register(soundName: string) {
      this.sounds[soundName] = new Audio.Sound()
    }

    load_sounds = async () => {
      this.register("피싱")
      this.register("쉭")
      this.register("undertale_change_color")
      this.register("sans_voice")
      this.register("바람")
      this.register("먹기")

      await this.sounds["피싱"].loadAsync(require("../assets/피싱.wav"));
      await this.sounds["쉭"].loadAsync(require("../assets/쉭.wav"));
      await this.sounds["undertale_change_color"].loadAsync(require("../assets/undertale_change_color.wav"));
      await this.sounds["sans_voice"].loadAsync(require("../assets/sans_voice.wav"));
      await this.sounds["바람"].loadAsync(require("../assets/[효과음]바람1.mp3"));
      await this.sounds["먹기"].loadAsync(require("../assets/[효과음]먹기1.mp3"));
    }

    play = async (sound: string) => {
      await this.sounds[sound].replayAsync();
    };
}