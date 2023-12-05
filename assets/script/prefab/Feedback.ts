import { _decorator, Component, EditBox, Node, Widget } from 'cc';
import { Config } from '../common/Config';
import { Context } from '../common/Context';
import { Native } from '../common/Enum';
import { SocketRun } from '../plugIn/SocketRun';
import { ContantEventName } from '../common/ContantEventName';
const { ccclass, property } = _decorator;

@ccclass('Feedback')
export class Feedback extends Component {
    @property(EditBox)
    editBox

    @property(Node)
    box: Node

    start() {
        this.node.getComponent(Widget).target = this.node.parent
    }

    btnSend() {
        if (this.editBox.string.trim()) {
            let native = ""
            if (Config.native == Native.Web) {
                native = "Web"
            }
            else {
                native = "Mobile Web"
            }
            let dataTransfer = {
                game_name: Config.key,
                user_locale: Context.getInstance().locale,
                language: "",
                feedbackContent: this.editBox.string,
                native: native
            }

            SocketRun.getInstance().send(ContantEventName.client_feedback_game, dataTransfer)
            this.editBox.string = ""
            this.node.active = false
        }
    }

    off() {
        this.node.active = false
    }

    update(deltaTime: number) {

    }
}


