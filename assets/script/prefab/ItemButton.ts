import { _decorator, Component, Node, Size, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemButton')
export class ItemButton extends Component {
    @property(Sprite)
    avatar: Sprite

    @property(Node)
    select: Node

    path
    setUp(buttonSprite: SpriteFrame, path, size){
        this.path = path
        const realW = buttonSprite.rect.width;
        const realH = buttonSprite.rect.height;

        let ratio = realW / size  
        let itemW = size
        let itemH = realH / ratio

        if (itemH > size) {
            ratio = itemH / size
            itemH = size
            itemW = itemW / ratio
        }

        if (realW < size && realH < size) {
            this.avatar.getComponent(UITransform).setContentSize(new Size(itemW * 0.5, itemH * 0.5));

        } else {
            this.avatar.getComponent(UITransform).setContentSize(new Size(itemW, itemH));

        }
        this.avatar.spriteFrame = buttonSprite
    }

    setupBg(buttonSprite: SpriteFrame, path){
        this.path = path
        this.avatar.spriteFrame = buttonSprite
    }

    start() {

    }

    callbackClick
    setUpCallback(callback){
        this.callbackClick = callback
    }


    onClick(){
        this.callbackClick()
    }
    update(deltaTime: number) {
        
    }
}


