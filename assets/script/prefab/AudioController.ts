import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { Tools } from '../common/Tools';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController = null;
    playBG: AudioClip | null = null;
    @property(AudioClip)
    buttonSound: AudioClip = null;
    @property(AudioClip)
    photoSound: AudioClip = null;
    @property(AudioClip)
    deleteSound: AudioClip = null;
    @property(AudioClip)
    unlockedSound: AudioClip = null
    @property(AudioSource)
    bgmClip: AudioSource
    backgroundMusicID;
    bgm: AudioClip = null;
    onLoad() {

        if (AudioController.instance == null) {

            director.addPersistRootNode(this.node);
            AudioController.instance = this;
            
            // Get the AudioSource component
            const isMusic = Tools.getDataStorage("music");
            if (isMusic) {
                this.playBGMusic();
            }
            if (Tools.getDataStorage("music") == null || Tools.getDataStorage("music") == undefined) {
                Tools.saveDataStorage("music", true)
                this.playBGMusic();
            }
            if(Tools.getDataStorage("sound") == null || Tools.getDataStorage("sound") == undefined) {
                this._soundOn = true;
                Tools.saveDataStorage("sound", true)
            }
            else{
                this._soundOn = Tools.getDataStorage("sound");
            }
            
        }
    }
    private _soundOn: boolean = false;
    public setSound(value: boolean) {
        this._soundOn = value;
    }


    public playBGMusic() {

        if (this.bgmClip) {
            Tools.loadSoundAsset('audio/bgm', (sound) => {
                //check again
                this.bgmClip.clip = sound;
                this.bgmClip.loop = true;
                this.bgmClip.play();
            });
        } else {
            this.bgmClip.play();
        }

    }



    //
    playButtonSound() {
        if (this._soundOn) {
            this.bgmClip.playOneShot(this.buttonSound, 1)
        }
    }
    playPhotoSound() {
        if (this._soundOn) {
            this.bgmClip.playOneShot(this.photoSound, 1)
        }
    }
    playDeleteSound() {
        if (this._soundOn) {
            this.bgmClip.playOneShot(this.deleteSound, 1)
        }
    }
    playUnlockedSound() {
        if (this._soundOn) {
            this.bgmClip.playOneShot(this.unlockedSound, 1)
        }
    }


}


