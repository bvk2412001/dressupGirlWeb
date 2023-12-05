import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemGallery')
export class ItemGallery extends Component {
    @property(Node)
    bg: Node

    @property(Node)
    select: Node

    @property(Node)
    delete: Node

    @property(Node)
    fb: Node
    callbackOnClick
    callbackDelete
    callbackShareFB
    setup(callbackonClick, callbackDelete, callbackShareFB) {
        this.callbackOnClick = callbackonClick;
        this.callbackDelete = callbackDelete
        this.callbackShareFB = callbackShareFB
    }




    onClick() {
        if (this.callbackOnClick)
            this.callbackOnClick()
    }
    btndelete() {
        if (this.callbackDelete)
            this.callbackDelete()
    }

    btnFacebook() {
        if (this.callbackShareFB)
            this.callbackShareFB()
    }
}


