import { _decorator, Component, Node, randomRangeInt } from 'cc';
import { HandleMessage } from './HandleMessage';
import io from 'socket.io-client/dist/socket.io.js';
import { Config } from '../common/Config';
import { ContantEventName } from '../common/ContantEventName';
import { Context } from '../common/Context';
import { Tools } from '../common/Tools';
import { RandomName } from '../common/RandomName';
const { ccclass, property } = _decorator;

@ccclass('SocketRun')
export class SocketRun extends Component {
    public static ins: SocketRun = null
    private io = null;
    private socket = null;

    public static getInstance() {
        if (this.ins == null) {
            this.ins = new SocketRun()

        }
        return this.ins
    }


    connect() {
        if (Config.debug) {
            Config.url = Config.urlDev
        }
        else {
            Config.url = Config.urlLive
        }

        this.socket = io(Config.url)

        this.socket.on("connect", () => {
            //SocketRun.getInstance().send(ContantEventName.client_get_list_chat, {locale: Context.getInstance().locale, limit: 20})
            if (Tools.getDataStorage("account")) {
                SocketRun.getInstance().send(ContantEventName.client_login,
                    {
                        userCode: Tools.getDataStorage("account").userCode,
                        userName: Tools.getDataStorage("account").userName,
                        photoUrl: Tools.getDataStorage("account").photoUrl,
                        locale: Tools.getDataStorage("account").locale

                    })
            }
            else {
                let userName = RandomName.Name_random[randomRangeInt(0, RandomName.Name_random.length)] + randomRangeInt(0, 1000)
                SocketRun.getInstance().send(ContantEventName.client_login,
                    {
                        userCode: new Date().getTime() + new Date().toLocaleTimeString() + userName,
                        userName: userName,
                        photoUrl: Context.getInstance().avatar,
                        locale: Context.getInstance().locale

                    })
            }

        })
        this.socket.onAny((eventName, ...args) => {
            HandleMessage.onlistening(eventName, ...args);
        });

    }

    update(deltaTime: number) {

    }

    send(eventName, data = null) {
        if (this.socket) {
            console.log("=============================>>>", eventName, data);
            if (data != null) {
                this.socket.emit(eventName, data);
            } else
                this.socket.emit(eventName);
        }
    }
}


