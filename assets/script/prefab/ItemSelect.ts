import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemSelect')
export class ItemSelect extends Component {
    @property(Sprite)
    avatar: Sprite

    @property(Sprite)
    select: Sprite

    @property(Node)
    selectNode: Node


    setUp(avatar: SpriteFrame, select: SpriteFrame) {
        this.avatar.spriteFrame = avatar
        this.select.spriteFrame = select
    }
}


