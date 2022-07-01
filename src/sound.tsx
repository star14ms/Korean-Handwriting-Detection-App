import { Audio } from "expo-av";


export default class Sounds {
    sounds: {[key: string]: {object: Audio.Sound, path: string, isPlaying: boolean}};
    soundPlaying = false
  
    constructor() {
      this.sounds = {}
      this.load_sounds()
    }
    
    load_sounds = async () => {
      this.sounds["detecting"] = {
        object: new Audio.Sound(),
        path: "../assets/피싱.wav",
        isPlaying: false,
      }
      await this.sounds["detecting"].object.loadAsync(require("../assets/피싱.wav"));
    }

    play = async (sound: string) => {
      await this.sounds[sound].object.replayAsync();
    };
}