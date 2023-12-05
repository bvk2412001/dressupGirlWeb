import { _decorator, Component, director, Node } from 'cc';
import { ContantEventName } from '../common/ContantEventName';
import { Context } from '../common/Context';
import { Tools } from '../common/Tools';
const { ccclass, property } = _decorator;

@ccclass('HandleMessage')
export class HandleMessage extends Component {
    static onlistening(eventName, ...args) {
        console.log(args, "test")
        const dataServer = args[0];
        const data = dataServer.data
        console.log("<<<=============================", eventName, data, dataServer.message);

        if (dataServer.success == false) {

        }

        switch (eventName) {
            case ContantEventName.server_send_list_chat:
                break;

            case ContantEventName.server_login:
                Tools.saveDataStorage("account", data)
                Context.getInstance().user = data
                Context.getInstance().indexLoadRes++
                break;

            case ContantEventName.server_update_profile:
                Tools.saveDataStorage("account", data)
                Context.getInstance().user = data
                break;
        }


        director.emit(eventName, data)
    }
}


