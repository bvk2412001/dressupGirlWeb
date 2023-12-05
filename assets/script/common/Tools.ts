import { _decorator, AssetManager, assetManager, AudioClip, Button, Component, ImageAsset, instantiate, Node, Prefab, resources, screen, Size, sp, SpriteAtlas, SpriteFrame, sys, Texture2D, UITransform, Vec3 } from 'cc';
import { Config } from './Config';
import { category, Native } from './Enum';
import { ContantSpines } from './ContantSpines';
import { Doll } from '../prefab/Doll';
import { DataSaveItem } from '../prefab/DataSaveItem';
import { StaticData } from './StaticData';
import { IteminSence } from '../prefab/IteminSence';
const { ccclass, property } = _decorator;

@ccclass('Tools')
export class Tools extends Component {
    public static loadSoundAsset(path, callback) {
        resources.load(path, AudioClip, (error, asset) => {
            callback(asset);
        })
    }

    public static getSizeWindow(width, height): Size {
        let newH: number = 0
        let newW: number = 0
        let scaleW = screen.windowSize.width / width
        let scaleH = screen.windowSize.height / height
        if (scaleW > scaleH) {
            newW = screen.windowSize.width / scaleH
            newH = height
        }
        else {
            newH = screen.windowSize.height / scaleW
            newW = width
        }
        return new Size(newW, newH)
    }
    public static loadFlag(): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load("FlagImg", (err, data: any) => {
                StaticData.flagImg = data.json;
                resolve(StaticData.flagImg);
            });
        })
    }


    public static getSizeCanvas() {
        let canvas = document.querySelector('canvas'); // Hoặc sử dụng ID cụ thể của canvas nếu có
        let style = window.getComputedStyle(canvas);
        let aspectRatioStyle = style.getPropertyValue('aspect-ratio')
        let ratioParts = aspectRatioStyle.split(' ');

        let width = parseFloat(ratioParts[1]);
        let height = parseFloat(ratioParts[3]);

        let newWidth: number;
        let newHeight: number;

        if (1080 != null) {
            // Tính toán chiều cao dựa trên chiều rộng
            newWidth = 1080;
            newHeight = 1080 * (height / width);
        } else if (1920 != null) {
            // Tính toán chiều rộng dựa trên chiều cao
            newHeight = 1920;
            newWidth = 1920 * (width / height);

        }

        return new Size(newWidth, newHeight);

    }


    public static loadFBavatar(remoteUrl, callback) {
        assetManager.loadRemote<ImageAsset>(remoteUrl, { ext: '.png' }, function (err, imageAsset) {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();

            texture.image = imageAsset;
            spriteFrame.texture = texture;
            if (!err) {
                callback(null, spriteFrame, texture);
            }
            else {
                callback(err)
            }
            // ...
        })
    }

    public static saveDataStorage(key: string, value): void {
        sys.localStorage.setItem(key + Config.key, JSON.stringify(value));
    }

    public static getDataStorage(key: string) {
        return JSON.parse(sys.localStorage.getItem(key + Config.key));
    }

    public static removeDataStorage(key: string) {
        sys.localStorage.removeItem(key + Config.key)
    }
    public static loadPrefab(path, callback) {
        try {
            let prefab: Prefab = resources.get(path);
            if (prefab) {
                if (callback)
                    callback(null, prefab)
            } else {
                resources.load(path, Prefab, (err, prefab) => {
                    if (err) {
                        console.error("loadPrefeb: " + err);
                        if (callback)
                            callback(err, null)
                    } else {
                        if (callback)
                            callback(null, prefab)
                    }
                });
            }
        } catch (err) {
            console.error("loadPrefeb: " + err);
            callback(err, null)
        }
    }

    public static loadSpriteAtlas(path, callback) {
        resources.load(path, SpriteAtlas, (err, spriteAtlas: SpriteAtlas) => {
            if (err) {
            }
            else {
                if (callback) {
                    callback(spriteAtlas)
                }

            }
        })
    }

    static loadSpriteFrameAtlasFromPath(pathAtlas: string, imageName: string, callback) {
        resources.load(pathAtlas, SpriteAtlas, (err, atlas) => {
            if (err) {
            }
            else {
                if (callback) {
                    callback(atlas.getSpriteFrame(imageName))
                }
            }

        })
    }

    public static loadSprite(path, callback) {
        resources.load(path, ImageAsset, (err, imageAsset) => {
            if (!err) {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                if (!err) {
                    callback(spriteFrame, texture);
                }
            } else {
                ;
            }
        });
    }


    public static getListSpriteSpines(skeleton: sp.Skeleton) {
        let listSlots: Object[] = []
        for (let i = 0; i < skeleton._skeleton.slots.length; i++) {
            let slots = skeleton._skeleton.slots[i]
            let color = { r: slots.color.r * 255, g: slots.color.g * 255, b: slots.color.b * 255, a: slots.color.a * 255 }
            let slot = {
                nameSlot: slots.data.name,
                nameItem: slots.getAttachment().name,
                color: color
            }

            listSlots.push(slot)
        }

        return listSlots

    }

    public static checkNative() {
        if (screen.windowSize.width < screen.windowSize.height) {
            return Native.Mobile;
        }
        else {
            return Native.Web
        }
    }



    public static setItemSlot(skeleton: sp.Skeleton, slotName, itemName, slot) {
        if (slot != ContantSpines.hairback && slot != ContantSpines.hairfront && slot != ContantSpines.hairside && slot != ContantSpines.coat) {
            skeleton._skeleton.slots.forEach(slot => {
                skeleton.setAttachment(slot.data.name, "undefined")
            })

        }
        else {
            skeleton.setAttachment("blank", "undefined")
        }
        skeleton.setAttachment(slotName, itemName)
    }

    public static setColorSlot(skeleton: sp.Skeleton, color, slotName) {
        let slot = skeleton.findSlot(slotName)
        slot.color.r = color.r / 255
        slot.color.g = color.g / 255
        slot.color.b = color.b / 255

    }

    public static setSpineSave(skeleton: sp.Skeleton, slotName, itemName, color) {

        if (slotName != ContantSpines.hairback && slotName != ContantSpines.hairfront && slotName != ContantSpines.hairside) {
        }
        Tools.setColorSlot(skeleton, color, slotName)
        skeleton.setAttachment(slotName, itemName)
    }


    public static saveDoll(doll: Doll) {
        let listSkeleton = []
        doll.listSkeleton.forEach(skeleton => {

            let listSlots: Object[] = []
            for (let i = 0; i < skeleton._skeleton.slots.length; i++) {
                let nameItem
                let slots = skeleton._skeleton.slots[i]
                if (slots.getAttachment()) {
                    nameItem = slots.getAttachment().name
                    let color = { r: slots.color.r * 255, g: slots.color.g * 255, b: slots.color.b * 255, a: slots.color.a * 255 }
                    let slot = {
                        nameSlot: slots.data.name,
                        nameItem: nameItem,
                        color: color


                    }
                    listSlots.push(slot)
                }
            }
            listSkeleton.push(listSlots)
        })

        return listSkeleton
    }


    public static addDoll(bg, scale, data) {
        let newDoll = instantiate(StaticData.doll)
        bg.addChild(newDoll)
        newDoll.getChildByName("body").setScale(new Vec3(scale, scale, 1))
        newDoll.getComponent(Button).enabled = false
        data.forEach((slot, index) => {
            slot.forEach(item => {
                Tools.setSpineSave(newDoll.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
            })

        })
    }

    public static setPhoto(bg: Node, dataSaveItems: DataSaveItem, x, y, zindex, listtexture: Texture2D[] = null) {
        switch (dataSaveItems.type) {
            case "doll":
                if (bg) {
                    let newDoll = instantiate(StaticData.doll)
                    bg.addChild(newDoll)
                    newDoll.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                    newDoll.getComponent(Button).enabled = false
                    newDoll.getChildByName("body").setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                    newDoll.setSiblingIndex(zindex)
                    newDoll.getComponent(UITransform).setContentSize(new Size(newDoll.getComponent(Doll).avatar.getComponent(UITransform).contentSize.x * newDoll.getComponent(Doll).avatar.scale.x, newDoll.getComponent(Doll).avatar.getComponent(UITransform).contentSize.y * newDoll.getComponent(Doll).avatar.scale.y))

                    dataSaveItems.dataDoll.forEach((slot, index) => {
                        slot.forEach(item => {
                            Tools.setSpineSave(newDoll.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                        })

                    })

                }
                break;
            case category.sticker.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/sticker", dataSaveItems.path, (spriteFrame: SpriteFrame, texture: Texture2D) => {
                    if (bg.isValid) {
                        if (listtexture) {
                            listtexture.push(texture)
                        }
                        let newSticker = instantiate(StaticData.itemInSence)
                        newSticker.getComponent(Button).enabled = false
                        bg.addChild(newSticker)

                        newSticker.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        newSticker.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                        newSticker.getComponent(IteminSence).setUp(spriteFrame)

                    }
                })
                break;
            case category.bubble.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/bubble", dataSaveItems.path, (spriteFrame: SpriteFrame, texture: Texture2D) => {

                    if (bg.isValid) {
                        if (listtexture) {
                            listtexture.push(texture)
                        }
                        let newBubble = instantiate(StaticData.itemInSence)
                        newBubble.getComponent(Button).enabled = false
                        bg.addChild(newBubble)
                        newBubble.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        newBubble.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))
                        newBubble.getComponent(IteminSence).editbox.enabled = false
                        newBubble.getComponent(IteminSence).editbox.string = dataSaveItems.message
                        newBubble.getComponent(IteminSence).editbox.node.active = true
                        newBubble.getComponent(IteminSence).setUp(spriteFrame)
                    }
                })

                break;

            case category.key.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/key", dataSaveItems.path, (spriteFrame: SpriteFrame, texture: Texture2D) => {
                    if (bg.isValid) {
                        if (listtexture) {
                            listtexture.push(texture)
                        }
                        let key = instantiate(StaticData.itemInSence)
                        key.getComponent(Button).enabled = false
                        bg.addChild(key)
                        key.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        key.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))

                        key.getComponent(IteminSence).setUp(spriteFrame)
                    }
                })

                break;

            case category.pet.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/pet", dataSaveItems.path, (spriteFrame: SpriteFrame, texture: Texture2D) => {
                    if (bg.isValid) {
                        if (listtexture) {
                            listtexture.push(texture)
                        }
                        let pet = instantiate(StaticData.itemInSence)
                        pet.getComponent(Button).enabled = false
                        bg.addChild(pet)
                        pet.setPosition(new Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        pet.getComponent(IteminSence).avatar.node.setScale(new Vec3(dataSaveItems.scale.x * x, dataSaveItems.scale.y * y, 1))

                        pet.getComponent(IteminSence).setUp(spriteFrame)
                    }
                })
                break;
        }
    }

    public static downloadImage(data) {
        let a = document.createElement('a');
        a.href = data;
        a.download = 'downloaded-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }

    public static base64ToBlob(base64: string): Blob {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    public static wrapText(input: string, maxLineLength: number) {
        const words = input.split(' ');

        let result = "";
        let line = "";

        for (const i of words) {
            if ((line + i).length > maxLineLength) {
                if (line.length) {
                    result += line.trim() + '\n';
                    line = "";
                }
                if (i.length > maxLineLength) {
                    let tmp = i;
                    while (tmp.length > maxLineLength) {
                        result += tmp.substring(0, maxLineLength) + '\n';
                        tmp = tmp.substring(maxLineLength);
                    }
                    line = tmp + ' ';

                } else {
                    line = i + ' ';
                }
            } else {
                line += i + ' ';
            }
        }

        if (line.trim()) {
            result += line.trim();
        }

        return result;
    }
}


