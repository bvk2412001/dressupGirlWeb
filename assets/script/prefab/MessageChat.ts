import { _decorator, assetManager, Component, Label, Material, Node, Sprite, SpriteFrame } from 'cc';
import { Tools } from '../common/Tools';
import { StaticData } from '../common/StaticData';
const { ccclass, property } = _decorator;

@ccclass('MessageChat')
export class MessageChat extends Component {
    @property(Node)
    inf: Node

    @property(Sprite)
    avatar: Sprite

    @property(Label)
    userName: Label

    @property(Label)
    message: Label

    @property(Node)
    doll: Node

    @property(Material)
    material: Material

    @property(Sprite)
    localeSprite: Sprite

    dataChat

    textureAvatar
    textureLocale

    @property(SpriteFrame)
    avatarDefault: SpriteFrame

   

    isEdit
    type
    avatarUrl
    isRepeate = false
    userName1
    locale
    setUp(avatar, isRepeat, userName, locale) {
        this.avatarUrl = avatar;
        this.userName1 = userName
        this.locale = locale
        this.isRepeate = isRepeat
        this.avatar.node.active = false
        if (isRepeat == true) {
            this.inf.destroy()
        }
        else {
            this.isEdit = false
            Tools.loadFBavatar(StaticData.flagImg[locale], (err, sp) => {
                if (err) {
                    return
                }
    
                if (this.node) {
                    this.textureLocale = sp.texture
                    this.localeSprite.spriteFrame = sp;
                }
            });
    

            if (avatar.length == 1) {
                console.log(avatar)
                Tools.loadSpriteFrameAtlasFromPath("atlas/chat/avatar", "avatar " + avatar, (spriteFrame: SpriteFrame) => {
                    if (this.node) {
                        
                        this.avatar.spriteFrame = spriteFrame
                        this.avatar.node.active = true
                    }
                   
                })
                
            }
            else {
                Tools.loadFBavatar(avatar, (err, spriteFrame: SpriteFrame, texture) => {
                    if(err){
                        return
                    }
                    if (this.node) {
                        this.avatar.node.active = true
                        this.avatar.material = this.material
                        this.avatar.material.setProperty('u_text', texture, 0)

                        this.avatar.spriteFrame.texture = texture
                        this.textureAvatar = texture

                    }

                })
            }

            this.userName.string = userName
        }
    }


    release(){
        assetManager.releaseAsset(this.textureAvatar)
        assetManager.releaseAsset(this.textureLocale)
    }

    protected onDestroy(): void {
        this.release()
    }
}


