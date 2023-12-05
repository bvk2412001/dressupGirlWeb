import { _decorator, assetManager, Button, Camera, Color, Component, director, EditBox, EventTouch, game, Input, instantiate, Label, math, Node, path, Prefab, randomRangeInt, rect, RenderTexture, ResolutionPolicy, screen, ScrollView, Size, sp, Sprite, SpriteAtlas, SpriteFrame, tween, UIOpacity, UITransform, Vec3, view, Widget } from 'cc';
import { category, Native } from '../common/Enum';
import { Tools } from '../common/Tools';
import { ContantGame } from '../common/ContantGame';
import { StaticData } from '../common/StaticData';
import { ItemSelect } from '../prefab/ItemSelect';
import { Context } from '../common/Context';
import { SocketRun } from '../plugIn/SocketRun';
import { ContantEventName } from '../common/ContantEventName';
import { MessageChat } from '../prefab/MessageChat';
import { ItemButton } from '../prefab/ItemButton';
import { ColorPicker } from '../common/ColorPicker';
import { Doll } from '../prefab/Doll';
import { ContantSpines } from '../common/ContantSpines';
import { IteminSence } from '../prefab/IteminSence';
import { DataSaveItem } from '../prefab/DataSaveItem';
import { Gallery } from '../prefab/Web/Gallery';
import { ItemGallery } from '../prefab/ItemGallery';
import { ColorButton } from '../prefab/ColorButton';
import { CaptureScreen } from '../common/CaptureScreen';
import { AudioController } from '../prefab/AudioController';
import { Loading } from './Loading';
import { Theme } from '../prefab/Theme';
import { RandomName } from '../common/RandomName';
import { Config } from '../common/Config';
const { ccclass, property } = _decorator;

@ccclass('Web')
export class Web extends Component {
    @property(Node)
    left: Node

    @property(Node)
    right: Node

    @property(Node)
    middle: Node

    @property(Node)
    listItemSelect: Node

    @property(Prefab)
    itemSelect: Prefab


    @property(ScrollView)
    listItemButton: ScrollView


    @property(Prefab)
    itemButton: Prefab

    @property(Prefab)
    itemInSence: Prefab

    @property(Node)
    save: Node

    @property(Label)
    localeChat: Label

    @property(Prefab)
    messageUser: Prefab

    @property(Prefab)
    messagePlayer: Prefab

    @property(Prefab)
    messageDollPlayer: Prefab

    @property(Prefab)
    messageDollUser: Prefab

    @property(Node)
    selectLocale: Node

    @property(Node)
    selectGlobal: Node

    @property(Node)
    uiCreateAccout: Node

    @property(Sprite)
    avatar: Sprite

    @property(EditBox)
    nameUser: EditBox

    @property(EditBox)
    message: EditBox

    @property(ScrollView)
    listChat: ScrollView

    @property(Node)
    bg: Node

    @property(Node)
    chat: Node

    @property(Node)
    gallery: Node

    @property(ScrollView)
    listPhotoChat: ScrollView

    @property(Node)
    nodePhotoChat: Node

    @property(Prefab)
    colorButton: Prefab

    @property(ScrollView)
    listColorHair: ScrollView

    @property(Node)
    trash: Node

    @property(Camera)
    camera: Camera

    @property(Node)
    target: Node

    @property(Node)
    option: Node

    @property(Node)
    ui: Node

    @property(Node)
    bgShare: Node


    @property(Sprite)
    bgRight: Sprite

    @property(Sprite)
    bgLeft: Sprite

    @property(Sprite)
    bgSelectCategory: Sprite

    @property(Sprite)
    bgTopChat: Sprite

    @property(Sprite)
    bgBottomChat: Sprite

    @property(Sprite)
    topGallery: Sprite

    @property(Sprite)
    bgGallery: Sprite


    @property(Sprite)
    bgChatBot: Sprite

    @property(Node)
    loading: Node

    @property(Sprite)
    bgShadows: Sprite

    @property(Node)
    btnChatNode: Node

    @property(Node)
    btnGalleryNode: Node

    @property(Sprite)
    localeSprite: Sprite

    listColor1 = [new Color(71, 87, 154), new Color(215, 96, 167), new Color(63, 157, 180), new Color(116, 80, 170), new Color(216, 159, 87)]
    listColor2 = [new Color(91, 111, 197), new Color(237, 106, 184), new Color(68, 189, 194), new Color(130, 89, 190), new Color(255, 188, 103)]
    listColor3 = [new Color(237, 106, 184), new Color(130, 89, 190), new Color(237, 106, 184), new Color(68, 189, 194), new Color(130, 89, 190)]
    listColor4 = [new Color(177, 191, 254), new Color(255, 201, 224), new Color(159, 244, 230), new Color(210, 180, 254), new Color(255, 244, 191)]



    listNameItemSelect = new Array<String>(20)

    indexSelect = -1
    roomNo = Context.getInstance().locale

    lastId = null
    character: Node

    audio: Node
    feedback: Node
    theme: Node

    indexEdit = -1
    public static ins: Web
    pathBg = "bg (1)"
    protected onLoad(): void {
        Web.ins = this
        director.on(ContantEventName.server_update_profile, this.serverSendUpdateAccount, this);
        director.on(ContantEventName.server_send_list_chat, this.serverSendListChat, this);
        director.on(ContantEventName.server_chat_message, this.serverSendChat, this);
        director.on(ContantEventName.server_send_url, this.serverSendUrl, this);

    }
    serverSendUrl(data) {
        if (Config.debug == false) {
            const request = { data: data.secure_url };
            fetch(`https://dressupgirl.online/v1/api/upload/${Context.getInstance().user._id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            })
                .then(res => window.open(`https://www.facebook.com/sharer.php?u="https://dressupgirl.online/v1/api/upload/${Context.getInstance().user._id}"`, '_blank'));
        }
        else {
            console.log("nhan url", data)
            const request = { data: data.secure_url };
            fetch(`http://192.168.1.7:8686/v1/api/upload/${Context.getInstance().user._id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            })
                .then(res => window.open(`https://www.facebook.com/sharer.php?u="http://192.168.1.7:8686/v1/api/upload/${Context.getInstance().user._id}"`, '_blank'));
        }

        //window.open(`https://www.facebook.com/sharer.php?u=${data.secure_url}`, '_blank');
    }

    serverSendUpdateAccount(data) {
        this.nameUser.string = Context.getInstance().user.userName
        console.log("atlas/chat/avatar", "avatar " + Context.getInstance().user.photoUrl)
        Tools.loadSpriteFrameAtlasFromPath("atlas/chat/avatar", "avatar " + Context.getInstance().user.photoUrl, (spriteFrame: SpriteFrame) => {
            this.avatar.spriteFrame = spriteFrame
        })

    }

    start() {
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
        // this.listItemSelect.on(Input.EventType.TOUCH_START, () => {
        //     Web.ins.offZoomItem()
        // })
        // this.listItemButton.content.on(Input.EventType.TOUCH_START, () => {
        //     Web.ins.offZoomItem()
        // })

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
            this.character.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
            this.character.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
            this.character.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
            this.character.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
            this.saveProcess()
        }


        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: Context.getInstance().user.locale, limit: 20 })

    }


    btnEditName() {
        this.nameUser.focus()
    }
    public setPhoto(bg: Node, dataSaveItems: DataSaveItem, x, y) {
        switch (dataSaveItems.type) {
            case "doll":
                if (bg) {
                    this.character = instantiate(StaticData.doll)
                    bg.addChild(this.character)
                    this.character.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                    this.character.getChildByName("body").setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                    this.character.getComponent(UITransform).setContentSize(new Size(this.character.getComponent(Doll).avatar.getComponent(UITransform).contentSize.x * this.character.getComponent(Doll).avatar.scale.x, this.character.getComponent(Doll).avatar.getComponent(UITransform).contentSize.y * this.character.getComponent(Doll).avatar.scale.y))
                    this.character.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
                    this.character.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
                    this.character.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
                    this.character.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                    dataSaveItems.dataDoll.forEach((slot, index) => {
                        slot.forEach(item => {
                            Tools.setSpineSave(this.character.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                        })

                    })

                    this.saveProcess()

                }
                break;
            case category.sticker.toString():
                let newSticker = instantiate(StaticData.itemInSence)
                bg.addChild(newSticker)
                newSticker.getComponent(IteminSence).type123 = category.sticker
                newSticker.getComponent(IteminSence).path = dataSaveItems.path
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/sticker", dataSaveItems.path, (spriteFrame: SpriteFrame) => {
                    if (bg.isValid) {
                        newSticker.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        newSticker.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                        newSticker.getComponent(IteminSence).setUp(spriteFrame)
                        newSticker.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
                        newSticker.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
                        newSticker.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
                        newSticker.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)

                        this.saveProcess()
                    }
                })
                break;
            case category.bubble.toString():

                let newBubble = instantiate(StaticData.itemInSence)
                newBubble.getComponent(IteminSence).type123 = category.bubble
                newBubble.getComponent(IteminSence).path = dataSaveItems.path
                bg.addChild(newBubble)
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/bubble", dataSaveItems.path, (spriteFrame: SpriteFrame) => {
                    if (bg.isValid) {
                        newBubble.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        newBubble.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                        newBubble.getComponent(IteminSence).editbox.enabled = false
                        newBubble.getComponent(IteminSence).editbox.string = dataSaveItems.message
                        newBubble.getComponent(IteminSence).editbox.node.active = true
                        newBubble.getComponent(IteminSence).setUp(spriteFrame)

                        newBubble.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
                        newBubble.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
                        newBubble.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
                        newBubble.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                        this.saveProcess()
                    }
                })

                break;

            case category.key.toString():
                let key = instantiate(StaticData.itemInSence)
                bg.addChild(key)
                key.getComponent(IteminSence).type123 = category.key
                key.getComponent(IteminSence).path = dataSaveItems.path
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/key", dataSaveItems.path, (spriteFrame: SpriteFrame) => {
                    if (bg.isValid) {
                        key.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        key.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                        key.getComponent(IteminSence).setUp(spriteFrame)

                        key.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
                        key.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
                        key.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
                        key.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                        this.saveProcess()
                    }
                })

                break;

            case category.pet.toString():
                let pet = instantiate(StaticData.itemInSence)
                bg.addChild(pet)
                pet.getComponent(IteminSence).type123 = category.pet
                pet.getComponent(IteminSence).path = dataSaveItems.path
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/pet", dataSaveItems.path, (spriteFrame: SpriteFrame) => {
                    if (bg.isValid) {
                        pet.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        pet.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                        pet.getComponent(IteminSence).setUp(spriteFrame)
                        pet.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
                        pet.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
                        pet.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
                        pet.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                        this.saveProcess()
                    }
                })
                break;
        }
    }



    serverSendChat(data) {
        if (this.chat.getComponent(UIOpacity).opacity == 255) {
            if (this.listChat.content.children.length > 0) {
                if (data.sender == this.listChat.content.children[0].getComponent(MessageChat).dataChat.sender) {
                    this.createMessage(data, 0, true)
                }
                else {
                    this.createMessage(data, 0, false)
                }
            }
            else {
                this.createMessage(data, 0, false)
            }
        }

    }
    serverSendListChat(data) {
        if (data.roomNo == this.roomNo) {
            this.lastId = data.lastId
            data.listChat.forEach((element, index) => {
                if (index == 0 && this.listChat.content.children.length > 0) {
                    if (element.sender == this.listChat.content.children[this.listChat.content.children.length - 1].getComponent(MessageChat).dataChat.sender) {
                        this.createMessage(element, 999, true)
                    }
                    else {
                        this.createMessage(element, 999, false)
                    }
                }
                else {
                    if (index + 1 < data.listChat.length) {

                        if (element.sender == data.listChat[index + 1].sender) {
                            this.createMessage(element, 999, true)
                        }
                        else {
                            this.createMessage(element, 999, false)
                        }
                    }
                    else {
                        this.createMessage(element, 999, false)
                    }

                }
            })
        }
    }



    createMessage(data, index, isRepeat) {
        let newMess: Node = null
        if (Context.getInstance().user) {
            if (data.sender == Context.getInstance().user._id) {
                if (data.message.type == 0) {
                    newMess = instantiate(this.messageUser)
                    newMess.getComponent(MessageChat).message.string = Tools.wrapText(data.message.data, 40)
                    newMess.getChildByName("chatmessagebg2").getComponent(Sprite).color = StaticData.colorChatUser
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
            Tools.addDoll(newMess.getComponent(MessageChat).doll, 0.45, data.message.data)
        }
    }

    showUICreateAccount() {
        this.uiCreateAccout.active = true
    }



    selectAvatar(event, args) {
        event.target.parent.children.forEach(element => {
            if (element.getChildByName("avatar select")) {
                element.getChildByName("avatar select").active = false
            }
        })
        event.target.getChildByName("avatar select").active = true
        SocketRun.getInstance().send(ContantEventName.client_update_profile,
            {
                userId: Context.getInstance().user._id,
                userName: Context.getInstance().user.userName,
                photoUrl: args
            })
    }

    sendAccount() {
        if (Context.getInstance().avatar != "" && this.nameUser.string.trim()) {
            SocketRun.getInstance().send(ContantEventName.client_login,
                {
                    userCode: new Date().getTime() + new Date().toLocaleTimeString() + this.nameUser.string.trim(),
                    userName: this.nameUser.string.trim(),
                    photoUrl: Context.getInstance().avatar,
                    locale: Context.getInstance().user.locale

                })
        }
        else {

        }
    }



    setUpListItemSelect() {
        for (let i = 0; i <= 24; i++) {
            let newItem = instantiate(this.itemSelect)
            this.listItemSelect.addChild(newItem)
            let count = 0
            newItem.getChildByName("select").getChildByName("category select bg").getComponent(Sprite).color = StaticData.colorSelectCategory
            Tools.loadSpriteFrameAtlasFromPath("atlas/category/category", "category " + i, (spriteFrame: SpriteFrame) => {
                newItem.getComponent(ItemSelect).avatar.spriteFrame = spriteFrame

                count++
            })
            Tools.loadSpriteFrameAtlasFromPath("atlas/category/select", "select " + i, (spriteFrame: SpriteFrame) => {
                newItem.getComponent(ItemSelect).select.spriteFrame = spriteFrame
                count++
            })


            let call = () => {
                if (count == 2) {
                    if (i == 0) {
                        newItem.getComponent(ItemSelect).selectNode.active = true
                        this.showListItemButton(0)
                    }
                    newItem.on(Input.EventType.TOUCH_END, () => {

                        AudioController.instance.playButtonSound()

                        if (this.iSelect == false) {
                            onClick()
                        }


                    }, this)
                    let onClick = () => {
                        this.listItemSelect.children.forEach(item => {
                            item.getComponent(ItemSelect).selectNode.active = false
                        })
                        newItem.getComponent(ItemSelect).selectNode.active = true
                        this.showListItemButton(i)
                        this.scheduleOnce(() => {
                            this.offZoomItem()
                        }, 0.05)
                    }
                }
                else {
                    this.scheduleOnce(() => {
                        call()
                    }, 0.1)
                }
            }

            call()
        }
    }
    backHair = ""
    frontHair = ""
    sideHair = ""

    setUpListColor() {
        const totalColor = ColorPicker.HAIR_COLOR_LIST.length;
        let count = 0;
        for (let i = 0; i < Math.floor(totalColor / 2); i++) {
            for (let j = 0; j < 2; j++) {
                let colorItem = instantiate(this.colorButton);
                let mainColor = ColorPicker.HAIR_COLOR_LIST[count]
                let subColor = ColorPicker.SUB_HAIR_COLOR_LIST[count]
                let index = count
                colorItem.getComponent(ColorButton).setUp(count, ColorPicker.HAIR_COLOR_LIST[count], ColorPicker.SUB_HAIR_COLOR_LIST[count])

                this.listColorHair.content.addChild(colorItem);
                colorItem.on(Input.EventType.TOUCH_END, () => {
                    AudioController.instance.playButtonSound()
                    if (this.indexSelect == category.hairback) {
                        if (index != 0) {
                            this.character.getComponent(Doll).listSkeleton[category.hairback].setAttachment("hairback", "underlined");
                        }
                        else {
                            this.character.getComponent(Doll).listSkeleton[category.hairback].setAttachment("hairback", this.backHair);
                        }

                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairback], mainColor, "hairback-base")
                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairback], subColor, "hairback-line")
                    }

                    if (this.indexSelect == category.hairfront) {
                        if (index != 0) {
                            this.character.getComponent(Doll).listSkeleton[category.hairfront].setAttachment("hairfront", "underlined");
                        }
                        else {
                            this.character.getComponent(Doll).listSkeleton[category.hairfront].setAttachment("hairfront", this.frontHair);
                        }

                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairfront], mainColor, "hairfront-base")
                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairfront], subColor, "hairfront-line")
                    }

                    if (this.indexSelect == category.hairside) {
                        if (index != 0) {
                            this.character.getComponent(Doll).listSkeleton[category.hairside].setAttachment("hairside", "underlined");
                        }
                        else {
                            this.character.getComponent(Doll).listSkeleton[category.hairside].setAttachment("hairside", this.sideHair);
                        }

                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairside], mainColor, "hairside-base")
                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairside], subColor, "hairside-line")
                    }


                }, this)

                count++;
            }
        }

        // this.listColorHair.node.active = false
    }

    iSelect = false
    showListItemButton(index, args = null) {
        if (this.indexSelect == index && args == null) return
        if (this.iSelect == false) {
            this.iSelect = true
            this.loading.active = true
            this.listColorHair.node.parent.active = false
            this.listItemButton.content.destroyAllChildren()
            this.indexSelect = index

            switch (index) {
                case category.body:
                    this.loading.active = false
                    this.iSelect = false
                    for (let i = 0; i < ColorPicker.SKIN_COLOR_LIST.length; i++) {
                        this.createButtonBellow(i, null, ColorPicker.SKIN_COLOR_LIST[i], ContantSpines.body)
                    }
                    break

                case category.eyebrow:
                    this.loadAtlas("eyebrow", category.eyebrow, ContantSpines.eyebrow)
                    break

                case category.eye:
                    this.loadAtlas("eye", category.eye, ContantSpines.eye)
                    break

                case category.mouth:
                    this.loadAtlas("mouth", category.mouth, ContantSpines.mouth)
                    break

                case category.faceasset:
                    this.loadAtlas("faceasset", category.faceasset, ContantSpines.faceasset)
                    break

                case category.hairfront:
                    if (this.frontHair == "") {
                        this.listColorHair.node.parent.active = false
                    }
                    else {
                        this.listColorHair.node.parent.active = true
                    }
                    this.loadAtlas("hairfront", category.hairfront, ContantSpines.hairfront)
                    break

                case category.hairback:
                    if (this.backHair == "") {
                        this.listColorHair.node.parent.active = false
                    }
                    else {
                        this.listColorHair.node.parent.active = true
                    }
                    this.loadAtlas("hairback", category.hairback, ContantSpines.hairback)
                    break

                case category.hairside:
                    if (this.sideHair == "") {
                        this.listColorHair.node.parent.active = false
                    }
                    else {
                        this.listColorHair.node.parent.active = true
                    }
                    this.loadAtlas("hairside", category.hairside, ContantSpines.hairside)
                    break

                case category.clothestop:
                    this.loadAtlas("clothestop", category.clothestop, ContantSpines.clothestop)
                    break

                case category.dress:
                    this.loadAtlas("dress", category.dress, ContantSpines.dress)
                    break

                case category.clotheslow:
                    this.loadAtlas("clotheslow", category.clotheslow, ContantSpines.clotheslow)
                    break

                case category.coat:
                    this.loadAtlas("coat", category.coat, ContantSpines.coat)
                    break

                case category.sock:
                    this.loadAtlas("sock", category.sock, ContantSpines.sock)
                    break

                case category.shoe:
                    this.loadAtlas("shoe", category.shoe, ContantSpines.shoe)
                    break

                case category.neckasset:
                    this.loadAtlas("neckasset", category.neckasset, ContantSpines.neckasset)
                    break

                case category.earing:
                    this.loadAtlas("earing", category.earing, ContantSpines.earing)
                    break

                case category.bag:
                    this.loadAtlas("bag", category.bag, ContantSpines.bag)
                    break

                case category.headasset:
                    this.loadAtlas("headasset", category.headasset, ContantSpines.headasset)
                    break

                case category.glasses:
                    this.loadAtlas("glasses", category.glasses, ContantSpines.glasses)
                    break

                case category.wing:
                    this.loadAtlas("wing", category.wing, ContantSpines.wing)
                    break

                case category.key:
                    this.loadAtlas("key", category.key, "key")
                    break

                case category.bg:
                    this.loading.active = false
                    this.iSelect = false
                    for (let i = 0; i < 47; i++) {
                        Tools.loadSprite(`/texture/bg (${i + 1})`, (spriteFrame) => {

                            if (this.indexSelect == category.bg) {
                                this.createButtonBellow(i + 1, spriteFrame, null, `bg (${i + 1})`)
                            }
                        })
                    }
                    break

                case category.bubble:
                    this.loadAtlas("bubble", category.bubble, "")
                    break

                case category.pet:
                    this.loadAtlas("pet", category.pet, "")
                    break

                case category.sticker:
                    this.loadAtlas("sticker", category.sticker, "")
                    break
            }
        }

    }


    loadAtlas(key, index, slot) {
        Tools.loadSpriteAtlas("atlas/buttonBellow/" + key, (spriteAtlas: SpriteAtlas) => {
            this.iSelect = false
            if (this.indexSelect == index) {
                this.loading.active = false
                this.createItemBlank()
                for (let i = 0; i < spriteAtlas.getSpriteFrames().length; i++) {
                    this.createButtonBellow(i + 1, spriteAtlas.getSpriteFrames()[i], null, slot)
                }
            }
        })


    }

    createButtonBellow(index, spriteFrame, color, type) {
        let newItem = instantiate(this.itemButton)
        this.listItemButton.content.addChild(newItem)
        if (this.indexSelect != category.body) {
            if (this.indexSelect > 0 && this.indexSelect < 20) {
                if (this.indexSelect != category.hairback && this.indexSelect != category.hairfront && this.indexSelect != category.hairside) {
                    if (this.listNameItemSelect[this.indexSelect] == spriteFrame.name) {
                        this.listItemButton.content.children.forEach(element => {
                            element.getComponent(ItemButton).select.active = false
                        })
                        newItem.getComponent(ItemButton).select.active = true
                    }
                }
                else {
                    if (this.indexSelect == category.hairback) {
                        if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").getAttachment()) {
                            if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").getAttachment().name == "hairback/hairback-base/" + spriteFrame.name + "-base") {
                                this.listItemButton.content.children.forEach(element => {
                                    element.getComponent(ItemButton).select.active = false
                                })
                                newItem.getComponent(ItemButton).select.active = true

                            }

                        }
                    }

                    if (this.indexSelect == category.hairfront) {
                        if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").getAttachment()) {
                            if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").getAttachment().name == "hairfront/1/" + spriteFrame.name + "-base") {
                                this.listItemButton.content.children.forEach(element => {
                                    element.getComponent(ItemButton).select.active = false
                                })
                                newItem.getComponent(ItemButton).select.active = true

                            }

                        }
                    }

                    if (this.indexSelect == category.hairside) {
                        if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").getAttachment()) {
                            if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").getAttachment().name == "hairside/hairside-base/" + spriteFrame.name + "-base") {
                                this.listItemButton.content.children.forEach(element => {
                                    element.getComponent(ItemButton).select.active = false
                                })
                                newItem.getComponent(ItemButton).select.active = true

                            }

                        }
                    }
                }

                newItem.getComponent(ItemButton).setUp(spriteFrame, spriteFrame.name, 100)
                newItem.getComponent(ItemButton).setUpCallback(() => {
                    AudioController.instance.playButtonSound()

                    this.listItemButton.content.children.forEach(element => {
                        element.getComponent(ItemButton).select.active = false
                    })
                    newItem.getComponent(ItemButton).select.active = true
                    this.listNameItemSelect[this.indexSelect] = spriteFrame.name

                    if (this.indexSelect != category.hairback && this.indexSelect != category.hairfront && this.indexSelect != category.hairside && this.indexSelect != category.coat) {
                        Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], type + "/" + spriteFrame.name, type + "/" + spriteFrame.name, type)
                    }
                    else {
                        if (this.indexSelect == category.coat) {
                            Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "Coat", "coat/" + spriteFrame.name, type)
                            Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "coat-hand", "coat/hand/" + spriteFrame.name + "-hand", type)
                        }

                        else {
                            this.listColorHair.node.parent.active = true

                            if (this.indexSelect == category.hairback) {

                                this.backHair = "hairback/hairback/" + spriteFrame.name

                                if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").color.r == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").color.g == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").color.b == 1) {
                                    Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback", "hairback/hairback/" + spriteFrame.name, type)
                                }

                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback-base", "hairback/hairback-base/" + spriteFrame.name + "-base", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback-item", "hairback" + spriteFrame.name + "-item", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback-line", "hairback/hairback-line/" + spriteFrame.name + "-line", type)
                            }

                            if (this.indexSelect == category.hairfront) {
                                if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").color.r == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").color.g == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").color.b == 1) {
                                    Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront", "hairfront/3/" + spriteFrame.name, type)
                                }
                                this.frontHair = "hairfront/3/" + spriteFrame.name
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront-base", "hairfront/1/" + spriteFrame.name + "-base", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront-item", "hairfront/" + spriteFrame.name + "-item", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront-line", "hairfront/2/" + spriteFrame.name + "-line", type)
                            }

                            if (this.indexSelect == category.hairside) {
                                if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").color.r == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").color.g == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").color.b == 1) {
                                    Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside", "hairside/hairside/" + spriteFrame.name, type)
                                }
                                this.sideHair = "hairside/hairside/" + spriteFrame.name
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside-base", "hairside/hairside-base/" + spriteFrame.name + "-base", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside-item", "hairside/" + spriteFrame.name + "-item", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside-line", "hairside/hairside-line/" + spriteFrame.name + "-line", type)
                            }
                        }
                    }


                    this.scheduleOnce(() => {
                        this.offZoomItem()
                    }, 0.1)


                })
            }
            if (this.indexSelect >= 20) {
                if (this.indexSelect == 21) {
                    newItem.getComponent(ItemButton).setupBg(spriteFrame, spriteFrame.name)
                    newItem.getComponent(ItemButton).setUpCallback(() => {
                        AudioController.instance.playButtonSound()
                        this.offZoomItem()
                        this.pathBg = type
                        if (this.bgShadows) {
                            this.bgShadows.getComponent(Sprite).spriteFrame = spriteFrame
                        }
                        this.bg.getComponent(Sprite).spriteFrame = spriteFrame
                        this.listItemButton.content.children.forEach(element => {
                            element.getComponent(ItemButton).select.active = false
                        })
                        newItem.getComponent(ItemButton).select.active = true
                    })
                }
                else {

                    newItem.getComponent(ItemButton).setUp(spriteFrame, spriteFrame.name, 100)

                    newItem.getComponent(ItemButton).setUpCallback(() => {
                        AudioController.instance.playButtonSound()

                        newItem.getComponent(ItemButton).select.active = true
                        let newItemInSence = instantiate(StaticData.itemInSence)
                        newItemInSence.getComponent(IteminSence).setUp(spriteFrame)
                        newItemInSence.getComponent(IteminSence).type123 = this.indexSelect
                        this.bg.addChild(newItemInSence)

                        if (this.indexSelect == category.bubble) {
                            newItemInSence.getComponent(IteminSence).editbox.node.active = true
                            newItemInSence.getComponent(IteminSence).editbox.node.on(EditBox.EventType.EDITING_DID_ENDED, () => {
                                newItemInSence.getComponent(IteminSence).editbox.enabled = false
                                this.saveProcess()
                            }, this)
                        }
                        let randomx = randomRangeInt(-200, 200)
                        let randomy = randomRangeInt(-200, 200)
                        newItemInSence.setPosition(randomx, randomy)

                        newItemInSence.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
                        newItemInSence.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
                        newItemInSence.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
                        newItemInSence.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                        this.scheduleOnce(() => {
                            this.offZoomItem()
                        }, 0.1)

                    });
                }
            }


        }
        else {
            newItem.getComponent(ItemButton).avatar.color = color
            newItem.getComponent(ItemButton).setUpCallback(() => {
                AudioController.instance.playButtonSound()
                this.offZoomItem()
                Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], color, "body_base")

            })
        }

    }

    createItemBlank() {
        let newItem = instantiate(this.itemButton)
        this.listItemButton.content.addChild(newItem)
        newItem.getComponent(ItemButton).avatar.node.active = false
        newItem.getComponent(ItemButton).select.active = true
        newItem.getComponent(ItemButton).setUpCallback(() => {
            this.listItemButton.content.children.forEach(element => {
                element.getComponent(ItemButton).select.active = false
            })
            newItem.getComponent(ItemButton).select.active = true
            AudioController.instance.playButtonSound()
            this.listColorHair.node.parent.active = false
            if (this.indexSelect == category.hairfront) {
                this.frontHair = ""
            }
            if (this.indexSelect == category.hairback) {
                this.backHair = ""
            }

            if (this.indexSelect == category.hairside) {
                this.sideHair = ""
            }

            Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "blank", "blank", "blank")
            this.offZoomItem()

        })
    }

    // createGallery() {
    //     if (this.gallery) {
    //         this.gallery.show()
    //     }
    //     else {
    //         Tools.loadPrefab("prefab/Web/Galary", (err, prefab: Prefab) => {
    //             let galary = instantiate(prefab)
    //             this.gallery = galary.getComponent(Gallery)
    //             this.right.addChild(galary)
    //         })
    //     }
    // }


    setUpChat() {
        this.localeChat.string = Context.getInstance().user.locale.toUpperCase()

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
                }, 100, this.middle.getComponent(UITransform).contentSize.width, this.middle.getComponent(UITransform).contentSize.height, this.left.getComponent(UITransform).contentSize.width, 0)

            }
            else {
                this.scheduleOnce(() => {
                    wait()
                }, 0.1)
            }
        }

        wait()
    }

    isPhoto = false
    photo() {
        if (this.isPhoto == false) {
            this.isPhoto = true
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
                        this.camera.visibility = vi
                        //this.camera.enabled = false
                        this.camera.targetTexture = null
                        SocketRun.getInstance().send(ContantEventName.client_send_base_64, data)
                        this.bgShare.destroyAllChildren()
                        this.isPhoto = false
                    }, 100, this.middle.getComponent(UITransform).contentSize.width, this.middle.getComponent(UITransform).contentSize.height, this.left.getComponent(UITransform).contentSize.width, 0)

                }
                else {
                    this.scheduleOnce(() => {
                        wait()
                    }, 0.1)
                }
            }

            wait()
        }



    }
    isloadSence = false
    protected update(dt: number): void {
        if (window.innerWidth < StaticData.maxSize.width * 0.8 || window.innerWidth > StaticData.maxSize.width * 1.2 || window.innerHeight < StaticData.maxSize.height * 0.8 || window.innerHeight > StaticData.maxSize.height * 1.2) {
            let actualWidth = window.innerWidth * window.devicePixelRatio;
            let actualHeight = window.innerHeight * window.devicePixelRatio * 0.95;
            screen.windowSize = new math.Size(actualWidth, actualHeight)
            StaticData.maxSize.width = window.innerWidth
            StaticData.maxSize.height = window.innerHeight
            director.loadScene(ContantGame.web_sence)
        }
        this.optimalScrollView(this.listChat)
        this.optimizeScrollView(this.listItemButton)
        this.optimizeScrollView(Gallery.ins.listGallery)

        this.node.getComponent(UITransform).setContentSize(Tools.getSizeWindow(ContantGame.web_width, ContantGame.web_height))
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

    sendChatMessage() {
        if (this.message.string.trim()) {
            SocketRun.getInstance().send(ContantEventName.client_chat_message,
                {
                    sender: Context.getInstance().user._id,
                    message: { type: 0, data: this.message.string },
                    locale: this.roomNo
                })

            this.message.string = ""
        }
    }

    possisionStart
    touchStartItem(event: EventTouch) {
        let posCurrent = new Vec3(event.getUILocation().x, event.getUILocation().y, 0)
        this.possisionStart = event.target.getPosition().subtract(posCurrent)
        this.offZoomItem()
        this.showZoomItem(event.target.getChildByName("body"))


    }



    public moveItem(touchEvent: EventTouch) {
        if (touchEvent.target.getComponent(IteminSence)) {
            this.trash.active = true
        }
        let loc = touchEvent.getUILocation();
        let x = this.middle.getComponent(UITransform).contentSize.x
        let y = this.middle.getComponent(UITransform).contentSize.y


        let width = touchEvent.target.getComponent(UITransform).contentSize.width * touchEvent.target.getScale().x / 2
        let height = touchEvent.target.getComponent(UITransform).contentSize.height * touchEvent.target.getScale().y / 2



        if ((loc.x + this.possisionStart.x < x / 2 - width && loc.x + this.possisionStart.x > -x / 2 + width) && (loc.y + this.possisionStart.y < y / 2 - height && loc.y + this.possisionStart.y > -y / 2 + height)) {

            touchEvent.target.setPosition(new Vec3(loc.x, loc.y))
            touchEvent.target.translate(this.possisionStart)

        }
        else {
            if ((loc.x + this.possisionStart.x >= x / 2 - width + 10 || loc.x + this.possisionStart.x <= -x / 2 + width - 10) && (loc.y + this.possisionStart.y < y / 2 - height && loc.y + this.possisionStart.y > -y / 2 + height)) {
                touchEvent.target.setPosition(touchEvent.target.position.x, loc.y - y / 2)
            }

            if ((loc.x + this.possisionStart.x < x / 2 - width && loc.x + this.possisionStart.x > -x / 2 + width) && (loc.y + this.possisionStart.y >= y / 2 - height + 10 || loc.y + this.possisionStart.y <= -y / 2 + height - 10)) {
                touchEvent.target.setPosition(loc.x - this.bg.getComponent(UITransform).contentSize.x / 2, touchEvent.target.position.y)
            }
            //touchEvent.target.translate(this.possisionStart)
        }

    }

    public touchEndItem(touchEvent: EventTouch) {
        if (touchEvent.target.getComponent(IteminSence)?.editbox.node.active == true) {
            touchEvent.target.getComponent(IteminSence).editbox.enabled = true
            touchEvent.target.getComponent(IteminSence).editbox.focus()
        }
        let kcY = touchEvent.target.getWorldPosition().y - this.trash.getWorldPosition().y + touchEvent.target.position.y / 2;
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
    indexSibilingItem = -1
    showZoomItem(item: Node) {
        item.getChildByName("zoom line").active = true
        this.indexSibilingItem = item.parent.getSiblingIndex()
        item.parent.getChildByName("zoom").active = true
        item.parent.setSiblingIndex(999)
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

        StaticData.process = data
    }


    btnSaveDoll() {
        this.scheduleOnce(() => {

            this.offZoomItem()
            if (this.indexEdit == -1) {
                let list = []
                if (Tools.getDataStorage("photos")) {
                    list = Tools.getDataStorage("photos")
                }
                list.push(Tools.saveDoll(this.character.getComponent(Doll)))
                Tools.saveDataStorage("photos", list)
            }

            else {
                let list = []
                if (Tools.getDataStorage("photos")) {
                    list = Tools.getDataStorage("photos")
                    list[this.indexEdit] = Tools.saveDoll(this.character.getComponent(Doll))
                    Tools.saveDataStorage("photos", list)
                    this.btnReset()

                }
            }

            this.btnGallery()
        }, 0.1)


    }



    btnReset() {
        this.listNameItemSelect.fill("")
        this.backHair = ""
        this.frontHair = ""
        this.sideHair = ""
        this.offZoomItem()
        this.indexEdit = -1
        this.showListItemButton(this.indexSelect, "1")
        this.pathBg = "bg (1)"
        Tools.loadSprite(`/texture/bg (1)`, (spriteFrame) => {
            this.bg.getComponent(Sprite).spriteFrame = spriteFrame
        })

        this.bg.destroyAllChildren()
        this.character.destroy()
        this.character = instantiate(StaticData.doll)
        this.bg.addChild(this.character)
        this.character.on(Input.EventType.TOUCH_START, this.touchStartItem, this)
        this.character.on(Input.EventType.TOUCH_MOVE, this.moveItem, this)
        this.character.on(Input.EventType.TOUCH_END, this.touchEndItem, this)
        this.character.on(Input.EventType.TOUCH_CANCEL, this.touchEndItem, this)
    }

    btnChat() {
        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20 })
        this.btnChatNode.getComponent(Button).enabled = false
        this.btnGalleryNode.getComponent(Button).enabled = true

        this.btnChatNode.getComponent(Sprite).color = new Color(255, 255, 255, 150)
        this.btnGalleryNode.getComponent(Sprite).color = new Color(255, 255, 255, 255)


        this.chat.setSiblingIndex(1)
        this.gallery.setSiblingIndex(0)
        this.gallery.getComponent(UIOpacity).opacity = 0
        this.chat.getComponent(UIOpacity).opacity = 255
    }

    btnGallery() {
        this.listChat.content.destroyAllChildren()
        this.btnChatNode.getComponent(Button).enabled = true
        this.btnGalleryNode.getComponent(Button).enabled = false

        this.btnChatNode.getComponent(Sprite).color = new Color(255, 255, 255, 255)
        this.btnGalleryNode.getComponent(Sprite).color = new Color(255, 255, 255, 150)



        this.gallery.getComponent(UIOpacity).opacity = 255
        this.chat.getComponent(UIOpacity).opacity = 0
        this.chat.setSiblingIndex(0)
        this.gallery.setSiblingIndex(1)
        Gallery.ins.setUpGallery()
    }


    btnImage() {
        this.listPhotoChat.content.destroyAllChildren()
        this.nodePhotoChat.active = true
        if (Tools.getDataStorage("photos")) {
            let list = Tools.getDataStorage("photos")
            for (let i = list.length - 1; i >= 0; i--) {
                let newItemm = instantiate(StaticData.itemGallery)
                this.listPhotoChat.content.addChild(newItemm)
                newItemm.getComponent(ItemGallery).delete.active = false
                newItemm.getComponent(ItemGallery).fb.active = false
                Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.5, list[i])
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

    closeImageChat() {
        this.nodePhotoChat.active = false
    }

    offSelectAccount() {
        this.uiCreateAccout.active = false
    }

    optimalScrollView(scrollView: ScrollView) {
        if (this.node) {
            let view2 = scrollView.node.getChildByName("view");
            let view = view2.getComponent(UITransform).getBoundingBox();
            if (view) {
                if (scrollView.vertical) {
                    var viewRect = rect(- view.width / 2,
                        - scrollView.content.getComponent(UITransform).getBoundingBox().y - view.height / 2,
                        view.width,
                        view.height);
                    for (let i = 0; i < scrollView.content.children.length; i++) {
                        const node = scrollView.content.children[i];
                        if (viewRect.intersects(node.getComponent(UITransform).getBoundingBox())) {
                            node.getComponent(UIOpacity).opacity = 255
                            if (node.getComponent(MessageChat).isEdit == true) {
                                // let messchat = node.getComponent(MessageChat)
                                // messchat.isEdit = false
                                // messchat.setUp(messchat.avatarUrl, messchat.isRepeate, messchat.userName1, messchat.locale)

                            }
                        }
                        else {
                            node.getComponent(UIOpacity).opacity = 0
                            if (node.getComponent(MessageChat).isEdit == false) {
                                //let messchat = node.getComponent(MessageChat)
                                //messchat.isEdit = true
                                //messchat.localeSprite.spriteFrame = messchat.avatarDefault
                                //messchat.avatar.spriteFrame.texture = messchat.avatarDefault.texture
                                //messchat.release()
                            }

                        }
                    }
                }
            }
        }
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

    btnOption() {
        this.option.active = true
    }

    offOption() {
        this.option.active = false
    }
    checkTopScroll() {
        if (this.lastId) {
            SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20, lastId: this.lastId })
        }

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
                })
            }
        }
    }


    soundButon() {
        AudioController.instance.playButtonSound()
    }

    btnCommunity() {
        window.open('https://www.facebook.com/groups/1277638666022677', '_blank');
    }

    protected onDestroy(): void {
        Web.ins = null;
        director.off(ContantEventName.server_update_profile, this.serverSendUpdateAccount, this);

        director.off(ContantEventName.server_send_list_chat, this.serverSendListChat, this);
        director.off(ContantEventName.server_chat_message, this.serverSendChat, this);
        director.off(ContantEventName.server_send_url, this.serverSendUrl, this);

    }

    isClickTheme = false
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

                    this.theme.getComponent(Theme).setUp((index) => {
                        this.changeTheme(index)
                    })
                })
            }
        }
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


