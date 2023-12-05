import { _decorator, Component, Node, Widget } from 'cc';
import { Tools } from '../common/Tools';
const { ccclass, property } = _decorator;

@ccclass('Theme')
export class Theme extends Component {
    @property(Node)
    listTheme: Node


    selectThemeCallBack
    start() {
        this.node.getComponent(Widget).target = this.node.parent
        if (Tools.getDataStorage("theme")) {
            this.listTheme.children[Tools.getDataStorage("theme")].getChildByName("theme select").active = true
        }
        else {
            Tools.saveDataStorage("theme", 0)
            this.listTheme.children[Tools.getDataStorage("theme")].getChildByName("theme select").active = true
        }
    }


    setUp(selectThemeCallback) {
        this.selectThemeCallBack = selectThemeCallback;
    }


    actionSelectTheme(event, args) {
        this.selectThemeCallBack(Number(args))
        this.listTheme.children.forEach(element => {
            element.getChildByName("theme select").active = false
        })
        event.target.getChildByName("theme select").active = true
        Tools.saveDataStorage("theme", Number(args))
    }

    onClose(){
        this.node.active = false
    }

    update(deltaTime: number) {

    }
}


