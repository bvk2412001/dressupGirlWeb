import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorButton')
export class ColorButton extends Component {
    @property(Sprite)
    mainColor: Sprite

    @property(Sprite)
    subColor: Sprite

    @property(SpriteFrame)
    defaultColor: SpriteFrame

    start() {

    }


    setUp(index, colorMain, colorSub){
        if(index == 0){
            this.mainColor.spriteFrame = this.defaultColor
            this.subColor.node.active = false
        }
        else{
            this.mainColor.color = colorMain
            this.subColor.color = colorSub
        }
    }

    update(deltaTime: number) {
        
    }
}


