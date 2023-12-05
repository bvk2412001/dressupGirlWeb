import { _decorator, Color, Component, director, EditBox, Input, instantiate, Label, Node, Prefab, rect, ScrollView, Sprite, SpriteFrame, UIOpacity, UITransform } from 'cc';
import { Tools } from '../../common/Tools';
import { Context } from '../../common/Context';
import { SocketRun } from '../../plugIn/SocketRun';
import { ContantEventName } from '../../common/ContantEventName';
import { MessageChat } from '../MessageChat';
import { StaticData } from '../../common/StaticData';
import { ItemGallery } from '../ItemGallery';
import { Mobile } from '../../sence/Mobile';
const { ccclass, property } = _decorator;

@ccclass('Chat')
export class Chat extends Component {
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
    nodeCreateAccout: Node

    @property(Node)
    uiCreateAccout: Node
    
    @property(Color)
    listColor: Color[] = []
    
    @property(ScrollView)
    listChat: ScrollView

    @property(Sprite)
    avatar: Sprite

    
    @property(EditBox)
    nameUser: EditBox

    @property(EditBox)
    message: EditBox

    @property(ScrollView)
    listPhotoChat: ScrollView

    @property(Node)
    nodePhotoChat: Node
    
    lastId = null
    roomNo = Context.getInstance().locale
    start() {
        this.localeChat.string = Context.getInstance().locale.toUpperCase()
        if (Tools.getDataStorage("account")) {
            this.nodeCreateAccout.active = false
            Context.getInstance().user = Tools.getDataStorage("account")
        }
        this.listChat.node.on('scroll-to-top', this.checkTopScroll, this)
        SocketRun.getInstance().connect()
        
        director.on(ContantEventName.server_login, this.offUICreateAccount, this);
        director.on(ContantEventName.server_send_list_chat, this.serverSendListChat, this);
        director.on(ContantEventName.server_chat_message, this.serverSendChat, this);
    }
    
    checkTopScroll() {
        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20, lastId: this.lastId })
    }
    serverSendChat(data) {
        if (this.listChat.content.children.length > 0) {
            if (data.sender == this.listChat.content.children[0].getComponent(MessageChat).dataChat.sender) {
                this.createMessage(data, 0, true)
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
                    console.log(index + 1, data.listChat.length)
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
                }
                else {
                    newMess = instantiate(this.messageDollUser)


                }
            }
            else {
                if (data.message.type == 0) {
                    newMess = instantiate(this.messagePlayer)
                    console.log(newMess)
                    newMess.getComponent(MessageChat).message.string = Tools.wrapText(data.message.data, 40)
                }
                else {
                    newMess = instantiate(this.messageDollPlayer)

                }

                newMess.getComponent(MessageChat).setUp(data.avatar, isRepeat, data.userName)

            }
        }

        else {
            if (data.message.type == 0) {
                newMess = instantiate(this.messagePlayer)
                console.log(newMess)
                newMess.getComponent(MessageChat).message.string = Tools.wrapText(data.message.data, 40)
            }
            else {
                newMess = instantiate(this.messageDollPlayer)
            }

            newMess.getComponent(MessageChat).setUp(data.avatar, isRepeat, data.userName)

        }

        newMess.getComponent(MessageChat).dataChat = data
        if (index != 0) {
            this.listChat.content.addChild(newMess)

        }
        else {
            this.listChat.content.insertChild(newMess, 0)
        }

        if (data.message.type == 1) {
            Tools.addDoll(newMess.getComponent(MessageChat).doll, 0.75, data.message.data)
        }
    }

    showUICreateAccount() {
        this.uiCreateAccout.active = true
    }

    offUICreateAccount() {
        this.uiCreateAccout.active = false
        this.nodeCreateAccout.active = false
    }

    selectAvatar(event, args) {
        Context.getInstance().avatar = args
        Tools.loadSpriteFrameAtlasFromPath("atlas/chat/createUser", "avatar " + args, (spriteFrame: SpriteFrame) => {
            if (args == Context.getInstance().avatar) {
                this.avatar.spriteFrame = spriteFrame
            }
        })
    }

    sendAccount() {
        if (Context.getInstance().avatar != "" && this.nameUser.string.trim()) {
            SocketRun.getInstance().send(ContantEventName.client_login,
                {
                    userCode: new Date().getTime() + new Date().toLocaleTimeString() + this.nameUser.string.trim(),
                    userName: this.nameUser.string.trim(),
                    photoUrl: Context.getInstance().avatar,
                    locale: Context.getInstance().locale

                })
        }
        else {
            console.log("chua dc")
        }
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
                        }
                        else {
                            node.getComponent(UIOpacity).opacity = 0
                        }
                    }
                }
            }
        }
    }
    update(deltaTime: number) {
        this.optimalScrollView(this.listChat)
    }
    sendChatMessage() {
        this.closeImageChat()
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

    btnImage() {
        this.listPhotoChat.content.destroyAllChildren()
        this.nodePhotoChat.active = true
        if (Tools.getDataStorage("photos")) {
            let list = Tools.getDataStorage("photos")
            for (let i = list.length - 1; i >= 0; i--) {
                let newItemm = instantiate(StaticData.itemGalleryMobile)
                this.listPhotoChat.content.addChild(newItemm)
                newItemm.getComponent(ItemGallery).delete.active = false
                Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.5, list[i])
                if (Mobile.ins.indexEdit == i) {
                    newItemm.getComponent(ItemGallery).select.active = true
                }
                newItemm.on(Input.EventType.TOUCH_END, () => {
                    SocketRun.getInstance().send(ContantEventName.client_chat_message,
                        {
                            sender: Context.getInstance().user._id,
                            message: { type: 1, data: list[i] },
                            locale: this.roomNo
                        })

                    this.nodePhotoChat.active = false
                    this.listPhotoChat.content.destroyAllChildren()
                }, this)

            }
        }
    }

    getChat(event, args) {
        this.closeImageChat()
        this.listChat.content.destroyAllChildren()
        switch (args) {
            case "0":
                this.selectLocale.getComponent(Sprite).color = this.listColor[0]
                this.selectGlobal.getComponent(Sprite).color = this.listColor[1]
                this.roomNo = Context.getInstance().locale
                break;

            case "1":
                this.selectLocale.getComponent(Sprite).color = this.listColor[1]
                this.selectGlobal.getComponent(Sprite).color = this.listColor[0]
                this.roomNo = "global"
                break;
        }
        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20 })
    }
    
    closeImageChat() {
        this.nodePhotoChat.active = false
    }

    offSelectAccount(){
        this.uiCreateAccout.active = false
    }


}


