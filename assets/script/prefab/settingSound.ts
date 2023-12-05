import { _decorator, Component, Node, Widget } from 'cc';
import { Tools } from '../common/Tools';
import { AudioController } from './AudioController';
const { ccclass, property } = _decorator;

@ccclass('settingSound')
export class settingSound extends Component {

    @property(Node)
    tickSound: Node

    @property(Node)
    tickMusic: Node

    @property(Node)
    box: Node
    start() {
        this.node.getComponent(Widget).target = this.node.parent
        if (Tools.getDataStorage("sound")) {
            this.tickSound.active = Tools.getDataStorage("sound")
        }

        if (Tools.getDataStorage("music")) {
            this.tickMusic.active = Tools.getDataStorage("music")
        }

    }


    selectSound() {
        if (this.tickSound.active == false) {
            this.tickSound.active = true
            Tools.saveDataStorage("sound", true)
            AudioController.instance.setSound(true)
        }
        else {
            this.tickSound.active = false
            Tools.saveDataStorage("sound", false)
            AudioController.instance.setSound(false)
        }
    }

    selectMusic() {
        if (this.tickMusic.active == false) {
            this.tickMusic.active = true
            Tools.saveDataStorage("music", true)
            AudioController.instance.bgmClip.play()
        }
        else {
            this.tickMusic.active = false
            Tools.saveDataStorage("music", false)
            AudioController.instance.bgmClip.pause()
        }
    }

    off() {
        this.node.active = false
    }

    update(deltaTime: number) {

    }
}


