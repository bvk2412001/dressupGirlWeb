import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StaticData')
export class StaticData extends Component {
    public static maxSize = null

    public static doll: Prefab
    public static itemInSence: Prefab
    public static itemGallery: Prefab
    public static itemGalleryMobile: Prefab

    public static colorSelectChat
    public static colorChatOther
    public static colorSelectCategory
    public static colorChatUser
    public static process = null

    public static flagImg
}


