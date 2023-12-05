import { _decorator, Component, EditBox, HorizontalTextAlignment, Label, Node, Size, Sprite, SpriteFrame, UITransform, Vec3, VerticalTextAlignment, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IteminSence')
export class IteminSence extends Component {
    @property(EditBox)
    editbox: EditBox

    @property(Label)
    message: Label

    @property(Sprite)
    avatar: Sprite

    @property(Node)
    holder: Node

    type123

    getType(){
        return this.type123
    }
    path
    setUp(sprite: SpriteFrame){
        this.path = sprite.name
        this.avatar.spriteFrame = sprite
        this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.node.getComponent(UITransform).contentSize.x * this.avatar.node.scale.x, this.avatar.node.getComponent(UITransform).contentSize.y * this.avatar.node.scale.y))
    }

    zoomOut() {
        if (this.avatar.node.scale.x < 1.6) {
            this.avatar.node.setScale(this.avatar.node.getScale().add(new Vec3(0.1, 0.1, 0)))
            this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.node.getComponent(UITransform).contentSize.x * this.avatar.node.scale.x, this.avatar.node.getComponent(UITransform).contentSize.y * this.avatar.node.scale.y))
        }
    }


    zoomIn() {
        if (this.avatar.node.scale.x > 0.6) {
            if (this.avatar.node.getComponent(UITransform).contentSize.x * this.avatar.node.scale.x < 70 || this.avatar.node.getComponent(UITransform).contentSize.y * this.avatar.node.scale.y < 70) {
                if (this.avatar.node.getComponent(UITransform).contentSize.x * this.avatar.node.scale.x > this.avatar.node.getComponent(UITransform).contentSize.x
                    && this.avatar.node.getComponent(UITransform).contentSize.y * this.avatar.node.scale.y >= this.avatar.node.getComponent(UITransform).contentSize.y) {
                    this.avatar.node.setScale(this.avatar.node.getScale().subtract(new Vec3(0.1, 0.1, 0)))
                    this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.node.getComponent(UITransform).contentSize.x * this.avatar.node.scale.x, this.avatar.node.getComponent(UITransform).contentSize.y * this.avatar.node.scale.y))
                }
            }
            else {
                this.avatar.node.setScale(this.avatar.node.getScale().subtract(new Vec3(0.1, 0.1, 0)))
                this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.node.getComponent(UITransform).contentSize.x * this.avatar.node.scale.x, this.avatar.node.getComponent(UITransform).contentSize.y * this.avatar.node.scale.y))
            }
        }


    }

    update(deltaTime: number) {
        this.message.verticalAlign = VerticalTextAlignment.CENTER
        this.message.horizontalAlign = HorizontalTextAlignment.CENTER
        this.holder.getComponent(UITransform).setContentSize(new Size(150, 70))
        this.holder.getComponent(Widget).verticalCenter = 0
        this.holder.getComponent(Widget).horizontalCenter = 0
    }
}


