import { _decorator, Component, Input, instantiate, Label, Node, Prefab, ScrollView, Size, Sprite, UITransform, Vec3, Widget } from 'cc';
import { Tools } from '../../common/Tools';
import { ItemGallery } from '../ItemGallery';
import { Web } from '../../sence/Web';
import { Doll } from '../Doll';
import { ContantSpines } from '../../common/ContantSpines';
import { StaticData } from '../../common/StaticData';
import { Mobile } from '../../sence/Mobile';
import { AudioController } from '../AudioController';
import { CaptureScreen } from '../../common/CaptureScreen';
import { SocketRun } from '../../plugIn/SocketRun';
import { ContantEventName } from '../../common/ContantEventName';

const { ccclass, property } = _decorator;

@ccclass('Gallery')
export class Gallery extends Component {
    @property(ScrollView)
    listGallery: ScrollView

    public static ins: Gallery
    isPhoto = false
    @property(Label)
    titleGallery: Label
    protected start(): void {
        Gallery.ins = this
        this.node.on(Input.EventType.TOUCH_END, () => {
            if (Web.ins) {
                Web.ins.offZoomItem()
            }
            if (Mobile.ins) {
                Mobile.ins.offZoomItem()
            }
        })
        this.listGallery.content.on(Input.EventType.TOUCH_END, () => {
            if (Web.ins) {
                Web.ins.offZoomItem()
            }

            if (Mobile.ins) {
                Mobile.ins.offZoomItem()
            }
        })
        this.setUpGallery()
    }


    show() {
        this.node.active = true
        this.setUpGallery()
    }

    setUpGallery() {

        this.listGallery.content.destroyAllChildren()
        let list = []
        if (Tools.getDataStorage("photos")) {
            list = Tools.getDataStorage("photos")
        }

        this.titleGallery.string = "Gallery(" + list.length + ")"
        let index = 8
        if (list.length > 8) {
            index = list.length
        }
        for (let i = 0; i < index; i++) {
            if (i < list.length) {
                let newItemm

                if (Web.ins) {
                    newItemm = instantiate(StaticData.itemGallery)
                    this.listGallery.content.addChild(newItemm)
                    Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.5, list[i])

                }
                if (Mobile.ins) {
                    newItemm = instantiate(StaticData.itemGalleryMobile)
                    this.listGallery.content.addChild(newItemm)
                    Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.75, list[i])

                }


                if (Mobile.ins && Mobile.ins?.indexEdit == i) {
                    newItemm.getComponent(ItemGallery).select.active = true
                }
                if (Web.ins?.indexEdit == i) {
                    newItemm.getComponent(ItemGallery).select.active = true
                }
                newItemm.getComponent(ItemGallery).setup(() => {
                    if (Web.ins) {
                        Web.ins.offZoomItem()
                        Web.ins.indexEdit = i
                        this.listGallery.content.children.forEach(child => {
                            child.getComponent(ItemGallery).select.active = false
                        })
                        newItemm.getComponent(ItemGallery).select.active = true

                        console.log("check")

                        Web.ins.character.getComponent(Doll).listSkeleton.forEach(skeleton => {
                            skeleton._skeleton.slots.forEach(slot => {
                                if (slot.data.name != ContantSpines.body) {
                                    skeleton.setAttachment(slot.data.name, "undefined")
                                }
                            })
                            skeleton.setAttachment("blank", "blank")

                        })
                        list[i].forEach((slot, index) => {
                            slot.forEach(item => {
                                Tools.setSpineSave(Web.ins.character.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                            })

                        })

                        Web.ins.saveProcess()
                    }

                    if (Mobile.ins) {
                        Mobile.ins.offZoomItem()
                        Mobile.ins.indexEdit = i
                        this.listGallery.content.children.forEach(child => {
                            child.getComponent(ItemGallery).select.active = false
                        })
                        newItemm.getComponent(ItemGallery).select.active = true

                        Mobile.ins.character.getComponent(Doll).listSkeleton.forEach(skeleton => {
                            skeleton._skeleton.slots.forEach(slot => {
                                if (slot.data.name != ContantSpines.body) {
                                    skeleton.setAttachment(slot.data.name, "undefined")
                                }
                            })
                            skeleton.setAttachment("blank", "blank")

                        })
                        list[i].forEach((slot, index) => {
                            slot.forEach(item => {
                                Tools.setSpineSave(Mobile.ins.character.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                            })

                        })
                    }
                }, () => {
                    AudioController.instance.playDeleteSound()
                    if (Web.ins) {
                        Web.ins.offZoomItem()
                        list.splice(i, 1)
                        if (Web.ins.indexEdit == i) {
                            Web.ins.indexEdit = -1
                        }
                    }
                    if (Mobile.ins) {
                        Mobile.ins.offZoomItem()
                        list.splice(i, 1)
                        if (Mobile.ins.indexEdit == i) {
                            Mobile.ins.indexEdit = -1
                        }
                    }
                    Tools.saveDataStorage("photos", list)
                    this.setUpGallery()
                },
                    () => {
                        let that
                        if (Web.ins) {
                            that = Web.ins
                        }
                        else {
                            that = Mobile.ins
                        }
                        if (this.isPhoto == false) {
                            this.isPhoto = true
                            that.bgShare.destroyAllChildren()
                            let newDoll = instantiate(StaticData.doll)
                            that.bgShare.addChild(newDoll)
                           
                            if(Web.ins){
                                newDoll.getChildByName("body").setScale(new Vec3(1.2, 1.2, 1))
                            }
                            else{
                                newDoll.getChildByName("body").setScale(new Vec3(1.4, 1.4, 1))
                                newDoll.getChildByName("body").setPosition(new Vec3(0, 300, 0))
                            }
                            list[i].forEach((slot, index) => {
                                slot.forEach(item => {
                                    Tools.setSpineSave(newDoll.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                                })

                            })
                            let isLoadBg = false
                            Tools.loadSprite(`/texture/bg (2)`, (spriteFrame) => {
                                that.bgShare.getComponent(Sprite).spriteFrame = spriteFrame
                                isLoadBg = true
                            })
                            let wait = () => {
                                if (isLoadBg == true) {
                                    that.bgShare.children.forEach((element: Node) => {
                                        element.layer = that.bgShare.layer
                                        element.children.forEach((element1: Node) => {
                                            element1.layer = that.bgShare.layer
                                            element1.children.forEach((element2: Node) => {
                                                element2.layer = that.bgShare.layer
                                                element2.children.forEach((element3: Node) => {
                                                    element3.layer = that.bgShare.layer
                                                    element3.children.forEach((element4: Node) => {
                                                        element4.layer = that.bgShare.layer
                                                    })
                                                })
                                            })
                                        })
                                    })

                                    let vi = that.camera.visibility
                                    //that.camera.enabled = true
                                    that.camera.visibility = that.bgShare.layer
                                    if (Web.ins) {
                                        CaptureScreen.captureScreenshot(that.camera, (data) => {
                                            that.camera.visibility = vi
                                            //that.camera.enabled = false
                                            that.camera.targetTexture = null
                                            SocketRun.getInstance().send(ContantEventName.client_send_base_64, data)
                                            that.bgShare.destroyAllChildren()
                                            this.isPhoto = false
                                        }, 100, that.middle.getComponent(UITransform).contentSize.width, that.middle.getComponent(UITransform).contentSize.height, that.left.getComponent(UITransform).contentSize.width, 0)
                                    }
                                    else {
                                        CaptureScreen.captureScreenshot(that.camera, (data) => {
                                            that.camera.visibility = vi
                                            //that.camera.enabled = false
                                            that.camera.targetTexture = null
                                            SocketRun.getInstance().send(ContantEventName.client_send_base_64, data)
                                            that.bgShare.destroyAllChildren()
                                            this.isPhoto = false
                                        }, 100, that.canvas.getComponent(UITransform).contentSize.width, that.canvas.getComponent(UITransform).contentSize.height - that.nodeTest.getComponent(UITransform).contentSize.height, 0, (that.canvas.getComponent(UITransform).contentSize.height - that.nodeTest.getComponent(UITransform).contentSize.height) / 2 - 100)


                                    }
                                }
                                else {
                                    this.scheduleOnce(() => {
                                        wait()
                                    }, 0.1)
                                }
                            }

                            wait()
                        }
                    })

            }
            else {
                let newItemm
                if (Web.ins) {
                    newItemm = instantiate(StaticData.itemGallery)
                    this.listGallery.content.addChild(newItemm)

                }
                if (Mobile.ins) {
                    newItemm = instantiate(StaticData.itemGalleryMobile)
                    this.listGallery.content.addChild(newItemm)
                }

                newItemm.getComponent(ItemGallery).delete.active = false
                newItemm.getComponent(ItemGallery).fb.active = false
            }

        }

    }

}


