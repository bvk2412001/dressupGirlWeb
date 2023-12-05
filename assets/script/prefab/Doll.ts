import { _decorator, Component, Node, Size, sp, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Doll')
export class Doll extends Component {
    @property(sp.Skeleton)
    listSkeleton: sp.Skeleton[] = []

    @property(Node)
    avatar

    
    start() {
        
    }


    update(deltaTime: number) {
        
    }

    zoomOut() {
        if (this.avatar.scale.x < 1.6) {
            this.avatar.setScale(this.avatar.getScale().add(new Vec3(0.1, 0.1, 0)))
            this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.getComponent(UITransform).contentSize.x * this.avatar.scale.x, this.avatar.getComponent(UITransform).contentSize.y * this.avatar.scale.y))

        }
    }


    zoomIn() {
        if(this.avatar.scale.x > 0.6){
            if (this.avatar.getComponent(UITransform).contentSize.x * this.avatar.scale.x < 70 || this.avatar.getComponent(UITransform).contentSize.y * this.avatar.scale.y < 70) {
                if (this.avatar.getComponent(UITransform).contentSize.x * this.avatar.scale.x > this.avatar.getComponent(UITransform).contentSize.x
                    && this.avatar.getComponent(UITransform).contentSize.y * this.avatar.scale.y >= this.avatar.getComponent(UITransform).contentSize.y) {
                    this.avatar.setScale(this.avatar.getScale().subtract(new Vec3(0.1, 0.1, 0)))
                    this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.getComponent(UITransform).contentSize.x * this.avatar.scale.x, this.avatar.getComponent(UITransform).contentSize.y * this.avatar.scale.y))

                }
            }
            else {
                this.avatar.setScale(this.avatar.getScale().subtract(new Vec3(0.1, 0.1, 0)))
                this.node.getComponent(UITransform).setContentSize(new Size(this.avatar.getComponent(UITransform).contentSize.x * this.avatar.scale.x, this.avatar.getComponent(UITransform).contentSize.y * this.avatar.scale.y))
            }
        }
    }
}


