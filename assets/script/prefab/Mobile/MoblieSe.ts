import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Tools } from '../../common/Tools';
const { ccclass, property } = _decorator;

@ccclass('MoblieSe')
export class MoblieSe extends Component {
    start() {
        Tools.loadPrefab("prefab/Mobile/MoblieUI", (err, prefab: Prefab) => {
            let newNode = instantiate(prefab)
            this.node.addChild(newNode);
        })
    }

    update(deltaTime: number) {
        
    }
}


