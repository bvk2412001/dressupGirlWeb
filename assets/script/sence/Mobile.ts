import { _decorator, Camera, Canvas, Color, Component, director, EditBox, EventTouch, Input, instantiate, Label, Node, Prefab, randomRangeInt, rect, screen, ScrollView, Size, Sprite, SpriteAtlas, SpriteFrame, tween, UIOpacity, UITransform, Vec2, Vec3, view, Widget } from 'cc';
import { Tools } from '../common/Tools';
import { category } from '../common/Enum';
import { Doll } from '../prefab/Doll';
import { StaticData } from '../common/StaticData';
import { IteminSence } from '../prefab/IteminSence';
import { Gallery } from '../prefab/Web/Gallery';
import { AudioController } from '../prefab/AudioController';
import { Feedback } from '../prefab/Feedback';
import { settingSound } from '../prefab/settingSound';
import { DataSaveItem } from '../prefab/DataSaveItem';
import { CaptureScreen } from '../common/CaptureScreen';
import { SocketRun } from '../plugIn/SocketRun';
import { ContantEventName } from '../common/ContantEventName';
import { Web } from './Web';
import { Context } from '../common/Context';
import { Theme } from '../prefab/Theme';
import { MessageChat } from '../prefab/MessageChat';
import { ItemGallery } from '../prefab/ItemGallery';
const { ccclass, property } = _decorator;

@ccclass('Mobile')
export class Mobile extends Web {
    @property(Node)
    listItemSelect: Node

    @property(Prefab)
    itemSelect: Prefab

    @property(ScrollView)
    listItemButton: ScrollView

    @property(Prefab)
    itemButton: Prefab

    @property(Node)
    bg: Node


    @property(Node)
    canvas: Node

    @property(Node)
    trash: Node

    @property(Prefab)
    colorButton: Prefab

    @property(ScrollView)
    listColorHair: ScrollView

    @property(Node)
    listButton: Node

    @property(Node)
    bottom: Node

    @property(Node)
    galary: Node

    @property(Node)
    return: Node

    @property(Node)
    chat: Node
    @property(Node)
    ui: Node

    @property(Node)
    option: Node

    @property(Node)
    bgShare: Node

    @property(Camera)
    camera: Camera

    @property(Node)
    nodeTest: Node


    backHair = ""
    frontHair = ""
    sideHair = ""
    pathBg = "bg (1)"
    character: Node

    audio: Node
    feedback: Node

    listNameItemSelect = new Array<String>(20)

    listAtlas
    public static ins: Mobile


    protected onLoad(): void {
        Mobile.ins = this
        director.on(ContantEventName.server_update_profile, this.serverSendUpdateAccount, this);
        director.on(ContantEventName.server_send_list_chat, this.serverSendListChat, this);
        director.on(ContantEventName.server_chat_message, this.serverSendChat, this);
        director.on(ContantEventName.server_send_url, this.serverSendUrl, this);

    }
    start(): void {
        if (Tools.getDataStorage("theme")) {
            this.changeTheme(Tools.getDataStorage("theme"))
        }
        else {
            this.changeTheme(0)
        }

        this.listChat.node.on('scroll-to-top', this.checkTopScroll, this)
        this.listNameItemSelect.fill("")
        this.setUpListItemSelect()
        this.setUpChat()
        this.setUpListColor()

        this.nameUser.string = Context.getInstance().user.userName
        Tools.loadSpriteFrameAtlasFromPath("atlas/chat/avatar", "avatar " + Context.getInstance().user.photoUrl, (spriteFrame: SpriteFrame) => {
            this.avatar.spriteFrame = spriteFrame
        })

        Tools.loadFBavatar(StaticData.flagImg[Context.getInstance().user.locale], (err, sp) => {
            if (err) {
                return
            }

            if (this.node) {
                this.localeSprite.spriteFrame = sp;
            }
        });
        this.nameUser.node.on(EditBox.EventType.EDITING_DID_ENDED, () => {
            if (this.nameUser.string.trim()) {
                SocketRun.getInstance().send(ContantEventName.client_update_profile,
                    {
                        userId: Context.getInstance().user._id,
                        userName: this.nameUser.string.trim(),
                        photoUrl: Context.getInstance().user.photoUrl
                    })
            }

        }, this)
        if (StaticData.process) {

            let data = StaticData.process

            Tools.loadSprite(`texture/` + data.bg, (spriteFrame) => {
                this.pathBg = data.bg
                this.bgShadows.getComponent(Sprite).spriteFrame = spriteFrame
                this.bg.getComponent(Sprite).spriteFrame = spriteFrame
                this.saveProcess()
            })
            data.dataPhoto.forEach(element => {
                this.setPhoto(this.bg, element, 1, 1)
                this.saveProcess()
            })

        }


        else {
            this.character = instantiate(StaticData.doll)
            this.bg.addChild(this.character)
            this.character.getChildByName("body").setScale(new Vec3(1.4, 1.4))
            this.character.setPosition(new Vec3(0, 100, 0))
            this.character.getComponent(UITransform).setContentSize(new Size(this.character.getChildByName("body").getComponent(UITransform).contentSize.x * this.character.getChildByName("body").scale.x, this.character.getChildByName("body").getComponent(UITransform).contentSize.y * this.character.getChildByName("body").scale.y))
            this.character.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
            this.character.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
            this.character.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
            this.character.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
            this.saveProcess()
        }
        this.listItemSelect.on(Input.EventType.TOUCH_START, () => {
            this.offZoomItem()
        })
        this.listItemButton.content.on(Input.EventType.TOUCH_START, () => {
            this.offZoomItem()
        })


       
    }
    indexSelect = -1

    possisionStart
    touchStartItem(event: EventTouch) {
        let posCurrent = new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
        this.possisionStart = event.target.getPosition().subtract(posCurrent)
        this.offZoomItem()
        this.showZoomItem(event.target.getChildByName("body"))


    }


    createMessage(data, index, isRepeat) {
        let newMess: Node = null
        if (Context.getInstance().user) {
            if (data.sender == Context.getInstance().user._id) {
                if (data.message.type == 0) {
                    newMess = instantiate(this.messageUser)
                    newMess.getComponent(MessageChat).message.string = Tools.wrapText(data.message.data, 40)
                    newMess.getChildByName("chatmessagebg2").getComponent(Sprite).color = StaticData.colorChatUser
                    newMess.getComponent(MessageChat).message
                }
                else {
                    newMess = instantiate(this.messageDollUser)


                }
            }
            else {
                if (data.message.type == 0) {
                    newMess = instantiate(this.messagePlayer)
                    newMess.getComponent(MessageChat).message.string = Tools.wrapText(data.message.data, 40)
                    newMess.getChildByName("chatmessagebg").getComponent(Sprite).color = StaticData.colorChatOther
                }
                else {
                    newMess = instantiate(this.messageDollPlayer)

                }

                newMess.getComponent(MessageChat).setUp(data.avatar, isRepeat, data.userName, data.country)

            }
        }

        else {
            if (data.message.type == 0) {
                newMess = instantiate(this.messagePlayer)
                newMess.getComponent(MessageChat).message.string = Tools.wrapText(data.message.data, 40)
                newMess.getChildByName("chatmessagebg").getComponent(Sprite).color = StaticData.colorChatOther
            }
            else {
                newMess = instantiate(this.messageDollPlayer)
            }

            newMess.getComponent(MessageChat).setUp(data.avatar, isRepeat, data.userName, data.country)

        }

        newMess.getComponent(MessageChat).dataChat = data
        if (index != 0) {
            this.listChat.content.addChild(newMess)

        }
        else {
            this.listChat.content.insertChild(newMess, 0)
        }

        if (data.message.type == 1) {
            Tools.addDoll(newMess.getComponent(MessageChat).doll, 0.85, data.message.data)
        }
    }

    async pickImage() {
        try {
            // Cài đặt các tùy chọn cho file picker
            const options = {
                types: [
                    {
                        description: 'Images',
                        accept: {
                            'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                        }
                    }
                ]
            };

            // Mở file picker và giới hạn chỉ cho phép chọn hình ảnh
            const [fileHandle] = await window.showOpenFilePicker(options);
            const file = await fileHandle.getFile();
            const reader = new FileReader();
            reader.onloadend = function () {
                // reader.result chứa chuỗi base64 của ảnh
                const base64String = reader.result;
                console.log(base64String);

                // Xử lý chuỗi base64 ở đây (ví dụ: hiển thị ảnh, gửi lên server, v.v.)
            }
            reader.readAsDataURL(file);
            // Xử lý file ảnh ở đây
            console.log(file);
        } catch (e) {
            console.error(e);
        }
    }
    btnImage() {
        // this.pickImage()
        this.listPhotoChat.content.destroyAllChildren()
        this.nodePhotoChat.active = true
        if (Tools.getDataStorage("photos")) {
            let list = Tools.getDataStorage("photos")
            for (let i = list.length - 1; i >= 0; i--) {
                let newItemm = instantiate(StaticData.itemGalleryMobile)
                this.listPhotoChat.content.addChild(newItemm)
                newItemm.getComponent(ItemGallery).delete.active = false
                newItemm.getComponent(ItemGallery).fb.active = false
                Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.75, list[i])
                newItemm.getComponent(ItemGallery).setup(() => {
                    AudioController.instance.playButtonSound()
                    SocketRun.getInstance().send(ContantEventName.client_chat_message,
                        {
                            sender: Context.getInstance().user._id,
                            message: { type: 1, data: list[i] },
                            locale: this.roomNo
                        })

                    this.nodePhotoChat.active = false
                    this.listPhotoChat.content.destroyAllChildren()
                }, null, null)
            }
        }
    }
    btnTheme() {
        if (this.theme) {
            this.theme.active = true
        }
        else {
            if (this.isClickTheme == false) {
                this.isClickTheme = true
                Tools.loadPrefab("prefab/Web/theme", (err, prefab) => {
                    this.theme = instantiate(prefab)
                    this.ui.addChild(this.theme)
                    this.theme.setScale(new Vec3(1.7, 1.7, 1))

                    this.theme.getComponent(Theme).setUp((index) => {
                        this.changeTheme(index)
                    })
                })
            }
        }
    }


    public moveItem(touchEvent: EventTouch) {
        if (touchEvent.target.getComponent(IteminSence)) {
            this.trash.active = true
        }

        let loc = touchEvent.getUILocation();
        let x = this.bg.getComponent(UITransform).contentSize.x
        let y = this.bg.getComponent(UITransform).contentSize.y


        let width = touchEvent.target.getComponent(UITransform).contentSize.width * touchEvent.target.getScale().x / 2
        let height = touchEvent.target.getComponent(UITransform).contentSize.height * touchEvent.target.getScale().y / 2



        if ((loc.x + this.possisionStart.x < x / 2 - width && loc.x + this.possisionStart.x > -x / 2 + width) && (loc.y + this.possisionStart.y < y / 2 - height && loc.y + this.possisionStart.y > -y / 2 + height + y / 4)) {
            touchEvent.target.setPosition(new Vec3(loc.x, loc.y))
            touchEvent.target.translate(this.possisionStart)

        }

        else {
            if ((loc.x + this.possisionStart.x > x / 2 - width || loc.x + this.possisionStart.x < -x / 2 + width) && (loc.y + this.possisionStart.y < y / 2 - height && loc.y + this.possisionStart.y > -y / 2 + height + y / 4)) {
                touchEvent.target.setPosition(touchEvent.target.position.x, loc.y - y / 2)
            }

            if ((loc.x + this.possisionStart.x < x / 2 - width && loc.x + this.possisionStart.x > -x / 2 + width) && (loc.y + this.possisionStart.y > y / 2 - height || loc.y + this.possisionStart.y < -y / 2 + height + y / 4)) {
                touchEvent.target.setPosition(loc.x - x / 2, touchEvent.target.position.y)
            }
            //touchEvent.target.translate(this.possisionStart)
        }


    }


    getChat(event, args) {
        this.listChat.content.destroyAllChildren()
        switch (args) {
            case "0":
                this.selectLocale.getComponent(Sprite).enabled = true
                this.selectGlobal.getComponent(Sprite).enabled = false
                this.roomNo = Context.getInstance().user.locale
                this.selectLocale.getChildByName("title").getComponent(Label).color = StaticData.colorChatOther

                this.selectGlobal.getChildByName("title").getComponent(Label).color = new Color(255, 255, 255, 255)
                break;

            case "1":
                this.selectLocale.getComponent(Sprite).enabled = false
                this.selectGlobal.getComponent(Sprite).enabled = true
                this.roomNo = "global"
                this.selectLocale.getChildByName("title").getComponent(Label).color = new Color(255, 255, 255, 255)
                this.selectGlobal.getChildByName("title").getComponent(Label).color = StaticData.colorChatOther
                break;
        }
        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20 })
    }

    public touchEndItem(touchEvent: EventTouch) {
        if (touchEvent.target.getComponent(IteminSence)?.editbox.node.active == true) {
            touchEvent.target.getComponent(IteminSence).editbox.enabled = true
            touchEvent.target.getComponent(IteminSence).editbox.focus()
        }



        let kcY = touchEvent.target.getWorldPosition().y - this.trash.getWorldPosition().y + touchEvent.target.position.y / 2 + 20;

        if (kcY <= 0 && touchEvent.target.getComponent(IteminSence)) {
            if (touchEvent.target.isValid) {
                this.trash.active = false

                AudioController.instance.playDeleteSound()
                tween(touchEvent.target).parallel(
                    tween(touchEvent.target).to(0.2, { scale: new Vec3(0, 0, 1) }),
                    tween(touchEvent.target).call(() => {
                        //tween(touchEvent.target.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
                    })
                )
                    .call(() => {
                        touchEvent.target.destroy()
                    }).start()


            }
        }
        this.trash.active = false
    }

    indexEdit = -1
    btnSaveDoll() {
        this.btnGallery()
        this.offZoomItem()
        if (this.indexEdit == -1) {
            let list = []
            if (Tools.getDataStorage("photos")) {
                list = Tools.getDataStorage("photos")
            }
            list.push(Tools.saveDoll(this.character.getComponent(Doll)))
            Tools.saveDataStorage("photos", list)

            Gallery.ins.setUpGallery()
        }

        else {
            let list = []
            if (Tools.getDataStorage("photos")) {
                list = Tools.getDataStorage("photos")
                list[this.indexEdit] = Tools.saveDoll(this.character.getComponent(Doll))
                Tools.saveDataStorage("photos", list)

                Gallery.ins.setUpGallery()
                this.btnReset()

            }
        }
    }

    btnGallery() {
        this.offZoomItem()
        this.galary.getComponent(UIOpacity).opacity = 255
        this.galary.setSiblingIndex(999)
        this.bottom.active = false
        this.listButton.active = false
        Gallery.ins.setUpGallery()
    }

    btnReturn() {
        this.galary.getComponent(UIOpacity).opacity = 0
        this.galary.setSiblingIndex(0)
        this.bottom.active = true
        this.listButton.active = true
        this.return.active = false
    }

    btnChat() {
        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20 })
        this.offZoomItem()
        this.chat.setSiblingIndex(999)
        this.chat.getComponent(UIOpacity).opacity = 255
    }

    btnCloseChat() {
        this.listChat.content.destroyAllChildren()
        this.chat.setSiblingIndex(0)
        this.chat.getComponent(UIOpacity).opacity = 0
    }

    photo() {
        this.offZoomItem()

        this.bgShare.destroyAllChildren()
        let dataSave = StaticData.process

        dataSave.dataPhoto.forEach((element, index) => {
            Tools.setPhoto(this.bgShare, element, 1, 1, index, null)
        })
        let isLoadBg = false
        Tools.loadSprite(`/texture/${dataSave.bg}`, (spriteFrame) => {
            this.bgShare.getComponent(Sprite).spriteFrame = spriteFrame
            isLoadBg = true
        })
        let wait = () => {
            if (this.bgShare.children.length == dataSave.dataPhoto.length && isLoadBg == true) {
                this.bgShare.children.forEach((element: Node) => {
                    element.layer = this.bgShare.layer
                    element.children.forEach((element1: Node) => {
                        element1.layer = this.bgShare.layer
                        element1.children.forEach((element2: Node) => {
                            element2.layer = this.bgShare.layer
                            element2.children.forEach((element3: Node) => {
                                element3.layer = this.bgShare.layer
                                element3.children.forEach((element4: Node) => {
                                    element4.layer = this.bgShare.layer
                                })
                            })
                        })
                    })
                })

                let vi = this.camera.visibility
                //this.camera.enabled = true
                this.camera.visibility = this.bgShare.layer
                CaptureScreen.captureScreenshot(this.camera, (data) => {
                    console.log(data)
                    this.camera.visibility = vi
                    //this.camera.enabled = false
                    const request = {data: data};
                    this.camera.targetTexture = null
                    console.log()
                    SocketRun.getInstance().send(ContantEventName.client_send_base_64, data)
                    // fetch(`http://192.168.1.7:8686/v1/api/upload/${Context.getInstance().user._id}`, {
                    //     method: 'POST',
                    //     headers: {
                    //         'Accept': 'application/json, text/plain, */*',
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify(request)
                    //     }).then(res => res.json())
                    //     .then(res => window.open(`https://www.facebook.com/sharer.php?u="http://192.168.1.7:8686/v1/api/upload/${Context.getInstance().user._id}"`, '_blank'));
                    // this.bgShare.destroyAllChildren()


                }, 100, this.canvas.getComponent(UITransform).contentSize.width, this.canvas.getComponent(UITransform).contentSize.height - this.nodeTest.getComponent(UITransform).contentSize.height, 0, (this.canvas.getComponent(UITransform).contentSize.height - this.nodeTest.getComponent(UITransform).contentSize.height) / 2 - 100)

            }
            else {
                this.scheduleOnce(() => {
                    wait()
                }, 0.1)
            }
        }

        wait()


    }

    downloadImage() {
        this.offZoomItem()
        this.bgShare.destroyAllChildren()
        let dataSave = StaticData.process
        dataSave.dataPhoto.forEach((element, index) => {
            Tools.setPhoto(this.bgShare, element, 1, 1, index, null)
        })
        let isLoadBg = false
        Tools.loadSprite(`/texture/${dataSave.bg}`, (spriteFrame) => {
            this.bgShare.getComponent(Sprite).spriteFrame = spriteFrame
            isLoadBg = true
        })
        let wait = () => {
            if (this.bgShare.children.length == dataSave.dataPhoto.length && isLoadBg == true) {
                this.bgShare.children.forEach((element: Node) => {
                    element.layer = this.bgShare.layer
                    element.children.forEach((element1: Node) => {
                        element1.layer = this.bgShare.layer
                        element1.children.forEach((element2: Node) => {
                            element2.layer = this.bgShare.layer
                            element2.children.forEach((element3: Node) => {
                                element3.layer = this.bgShare.layer
                                element3.children.forEach((element4: Node) => {
                                    element4.layer = this.bgShare.layer
                                })
                            })
                        })
                    })
                })

                let vi = this.camera.visibility
                //this.camera.enabled = true
                this.camera.visibility = this.bgShare.layer
                CaptureScreen.captureScreenshot1(this.camera, (data) => {
                    this.camera.visibility = vi
                    //this.camera.enabled = false
                    this.camera.targetTexture = null
                    this.bgShare.destroyAllChildren()
                    Tools.downloadImage(data)
                }, 100, this.canvas.getComponent(UITransform).contentSize.width, this.canvas.getComponent(UITransform).contentSize.height - this.nodeTest.getComponent(UITransform).contentSize.height, 0, (this.canvas.getComponent(UITransform).contentSize.height - this.nodeTest.getComponent(UITransform).contentSize.height) / 2 - 100)

            }
            else {
                this.scheduleOnce(() => {
                    wait()
                }, 0.1)
            }
        }

        wait()
    }

    saveProcess() {
        let listdataSave = new Array<DataSaveItem>()
        this.bg.children.forEach(element => {
            let newDataSave
            if (element.getComponent(Doll)) {
                newDataSave = new DataSaveItem("doll", element.position, element.getChildByName("body").scale)
                newDataSave.dataDoll = Tools.saveDoll(element.getComponent(Doll))
            }
            else {
                newDataSave = new DataSaveItem(element.getComponent(IteminSence).type123.toString(), element.position, element.getChildByName("body").scale)
                newDataSave.path = element.getComponent(IteminSence).path

                if (element.getComponent(IteminSence).type123 == category.bubble) {
                    newDataSave.message = element.getComponent(IteminSence).editbox.string
                }
            }

            listdataSave.push(newDataSave)
        })


        let data = {
            bg: this.pathBg,
            dataPhoto: listdataSave
        }

        // Tools.saveDataStorage("processMobile", data)
        StaticData.process = data
    }


    btnReset() {
        this.backHair = ""
        this.frontHair = ""
        this.sideHair = ""
        this.listNameItemSelect.fill("")
        this.offZoomItem()
        this.indexEdit = -1
        this.showListItemButton(this.indexSelect, "1")

        this.pathBg = "bg (1)"
        Tools.loadSprite(`/texture/bg (1)`, (spriteFrame) => {
            this.bgShadows.getComponent(Sprite).spriteFrame = spriteFrame
            this.bg.getComponent(Sprite).spriteFrame = spriteFrame
        })

        this.bg.destroyAllChildren()
        this.character.destroy()
        this.character = instantiate(StaticData.doll)
        this.bg.addChild(this.character)
        this.character.getChildByName("body").setScale(new Vec3(1.4, 1.4))
        this.character.setPosition(new Vec3(0, 100, 0))
        this.character.getComponent(UITransform).setContentSize(new Size(this.character.getChildByName("body").getComponent(UITransform).contentSize.x * this.character.getChildByName("body").scale.x, this.character.getChildByName("body").getComponent(UITransform).contentSize.y * this.character.getChildByName("body").scale.y))
        this.character.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
        this.character.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
        this.character.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
        this.character.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
    }

    offZoomItem() {
        this.bg.children.forEach(element => {
            if (element.getChildByName("body").getChildByName("zoom line").active == true) {
                element.getChildByName("body").getChildByName("zoom line").active = false
                element.getChildByName("zoom").active = false
                element.setSiblingIndex(this.indexSibilingItem)
            }
        })

        this.saveProcess()
    }

    optimizeScrollView(scrollView: ScrollView) {
        let view2 = scrollView.node.getChildByName("view");
        let view = view2.getComponent(UITransform).getBoundingBox();
        let width = scrollView.content.getComponent(UITransform).contentSize.height
        if (view) {
            if (scrollView.vertical) {
                var viewRect = rect(
                    - view.width / 2,
                    - (width + (scrollView.content.getComponent(UITransform).getBoundingBox().y) + view.height / 3),
                    view.width,
                    view.height);

                for (let i = 0; i < scrollView.content.children.length; i++) {
                    const node = scrollView.content.children[i];
                    if (viewRect.intersects(node.getComponent(UITransform).getBoundingBox())) {
                        if (node.getComponent(UIOpacity)) {
                            node.getComponent(UIOpacity).opacity = 255;
                        }

                    }
                    else {
                        if (node.getComponent(UIOpacity)) {
                            node.getComponent(UIOpacity).opacity = 0;
                        }
                    }
                }

            }
        }
    }

    update(dt: number): void {
        this.ui.getComponent(UITransform).setContentSize(Tools.getSizeWindow(1080, 1920))
        this.optimizeScrollView(this.listItemButton)
        this.optimalScrollView(this.listChat)
        this.optimizeScrollView(Gallery.ins.listGallery)
        this.selectLocale.getComponent(Widget).right = this.bgTopChat.getComponent(UITransform).contentSize.width / 2
        this.selectGlobal.getComponent(Widget).left = this.bgTopChat.getComponent(UITransform).contentSize.width / 2



    }


    isClickAudio = false
    btnAudio() {
        if (this.audio) {
            this.audio.active = true
        }
        else {
            if (this.isClickAudio == false) {
                this.isClickAudio = true
                Tools.loadPrefab("prefab/settingSound", (err, prefab) => {
                    this.audio = instantiate(prefab)
                    this.ui.addChild(this.audio)
                    this.audio.getComponent(settingSound).box.setScale(new Vec3(1.7, 1.7, 1))
                })
            }
        }
    }



    isClickfeedback = false
    btnfeedback() {
        if (this.feedback) {
            this.feedback.active = true
        }
        else {
            if (this.isClickfeedback == false) {
                this.isClickfeedback = true
                Tools.loadPrefab("prefab/feedback", (err, prefab) => {
                    this.feedback = instantiate(prefab)
                    this.ui.addChild(this.feedback)
                    this.feedback.getComponent(Feedback).box.setScale(new Vec3(1.7, 1.7, 1))
                })
            }
        }
    }


    soundButon() {
        AudioController.instance.playButtonSound()
    }

    btnOption() {
        this.option.active = true
    }

    offOption() {
        this.option.active = false
    }

    btnCommunity() {
        window.open('https://www.facebook.com/groups/1277638666022677', '_blank');
    }

    changeTheme(index) {
        this.bgLeft.color = this.listColor1[index]
        this.bgRight.color = this.listColor1[index]
        this.bgSelectCategory.color = this.listColor3[index]
        this.bgTopChat.color = this.listColor2[index]
        this.bgBottomChat.color = this.listColor4[index]
        this.bgChatBot.color = this.listColor2[index]
        this.topGallery.color = this.listColor2[index]
        this.bgGallery.color = this.listColor1[index]
        StaticData.colorSelectChat = this.listColor4[index]
        StaticData.colorChatOther = this.listColor2[index]
        StaticData.colorSelectCategory = this.listColor2[index]
        StaticData.colorChatUser = this.listColor3[index]
        this.selectLocale.getComponent(Sprite).color = StaticData.colorSelectChat
        if (this.roomNo == "global") {
            this.selectLocale.getChildByName("title").getComponent(Label).color = new Color(255, 255, 255, 255)
            this.selectGlobal.getChildByName("title").getComponent(Label).color = this.listColor2[index]
        }
        else {
            this.selectLocale.getChildByName("title").getComponent(Label).color = this.listColor2[index]
            this.selectGlobal.getChildByName("title").getComponent(Label).color = new Color(255, 255, 255, 255)
        }

        this.selectGlobal.getComponent(Sprite).color = StaticData.colorSelectChat
        this.listChat.content.children.forEach(element => {
            if (element.name == "messagePlayer") {
                element.getChildByName("chatmessagebg").getComponent(Sprite).color = StaticData.colorChatOther
            }
        })

        this.listItemSelect.children.forEach(element => {
            element.getChildByName("select").getChildByName("category select bg").getComponent(Sprite).color = StaticData.colorSelectCategory
        })

        this.listChat.content.children.forEach(element => {
            if (element.name == "messageUser") {
                element.getChildByName("chatmessagebg2").getComponent(Sprite).color = StaticData.colorChatUser
            }
        })
    }
}


