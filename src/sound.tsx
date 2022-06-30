import { Audio } from "expo-av";


export default class Sounds {
    sounds: {[key: string]: Audio.Sound};
  
    constructor() {
      this.sounds = {}
      this.load_sounds()
    }
    
    load_sounds = async () => {
      this.sounds.detecting = new Audio.Sound()
      await this.sounds.detecting.loadAsync(require("../assets/피싱.wav"));
    }
    
    play = async (sound: string) => {
      await this.sounds[sound].playAsync();
    };
}