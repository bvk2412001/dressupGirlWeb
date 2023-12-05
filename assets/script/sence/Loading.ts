import { _decorator, Component, director, Label, Node, PhysicsSystem, ProgressBar, ResolutionPolicy, screen, Size, sys, UITransform, Vec3, view } from 'cc';
import { Config } from '../common/Config';
import { Tools } from '../common/Tools';
import { Native } from '../common/Enum';
import { ContantGame } from '../common/ContantGame';
import { Context } from '../common/Context';
import { StaticData } from '../common/StaticData';
import { SocketRun } from '../plugIn/SocketRun';
import { fireBase } from '../firebase/fireBase';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    @property(Boolean)
    debug: Boolean = false;
    @property(Boolean)
    private facebook: Boolean = false;
    @property(Boolean)
    public android: Boolean = false;
    @property(Boolean)
    public web: Boolean = false;
    @property(Boolean)
    public ios: Boolean = false;
    @property(String)
    public version: String = "";

    @property(ProgressBar)
    loadingProgressBar: ProgressBar;

    @property(Label)
    loadingLb: Label

    @property(Node)
    avatar: Node
    protected onLoad(): void {
        fireBase.instance.LogEvent("onLoad");
        let canvas = document.querySelector('canvas');
        let style = window.getComputedStyle(canvas);
        let aspectRatioStyle = style.getPropertyValue('aspect-ratio')
        let ratioParts = aspectRatioStyle.split(' ');
        if (this.debug == false) {
            //console.log = function () { };
            console.warn = function () { };
            console.info = function () { };
        }
        else {
            Config.debug = true
        }
        if (this.web == true) {
            Config.native = Tools.checkNative()
            console.log(Config.native)
            if (Config.native == Native.Web) {
                this.avatar.setScale(new Vec3(0.6, 0.6, 0.6))
                this.loadingProgressBar.node.setScale(new Vec3(0.6, 0.6, 0.6))
                view.setDesignResolutionSize(1920, 1080, ResolutionPolicy.SHOW_ALL)
                StaticData.maxSize = new Size(window.innerWidth, window.innerHeight)
            }
            else {
                view.setDesignResolutionSize(1080, 1920, ResolutionPolicy.SHOW_ALL)
                StaticData.maxSize = new Size(window.innerWidth, window.innerHeight)

            }
        }


    }
    start() {
        Tools.loadFlag()
        //fireBase.instance.LogEvent("Khoa check")
        this.loading()
        Context.getInstance().getLocale()

        let loadLocale = () => {
            if (Context.getInstance().locale != "") {
                SocketRun.getInstance().connect()

            }
            else {
                this.scheduleOnce(() => {
                    loadLocale()
                }, 0.1)
            }
        }

        loadLocale()

        Context.getInstance().startGame()
    }


    delay = 0.0002
    count = 0
    loading() {
        try {
            if (this.loadingProgressBar.progress < 1) {
                this.delay += 0.0005;
                this.loadingProgressBar.progress += 0.002;
                this.loadingLb.string ="Loading..." +  Math.round(this.loadingProgressBar.progress * 100) + "%";
            }
            this.scheduleOnce(() => {
                this.loading();
            }, this.delay);
        } catch (error) {
            console.error(error);
        }
    }

    update(deltaTime: number) {
        if (Config.native == Native.Mobile) {
            this.node.getComponent(UITransform).setContentSize(Tools.getSizeWindow(ContantGame.mobile_width, ContantGame.mobile_height))
        }
        else {
            this.node.getComponent(UITransform).setContentSize(Tools.getSizeWindow(ContantGame.web_width, ContantGame.web_height))
        }
    }
}


