import { _decorator, Component, Node, Size, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Config')
export class Config extends Component {
    public static key = "DressUp_New"
    public static debug = false
    public static ANDROID = 2;
    public static FACEBOOK = 1;
    public static IOS = 3;
    public static WEB = 4;
    public static platform = Config.ANDROID;
    public static os = sys.os;
    public static version = "1.0.0"
    public static native = 0
    //public static urlDev = "192.168.31.156:3000"
    public static urlDev = "192.168.1.7:8686"
    public static urlLive = "https://maxgame.vxh87.online/"   

    public static url = null

}


