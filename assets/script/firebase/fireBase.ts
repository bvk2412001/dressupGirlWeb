import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('fireBase')
export class fireBase extends Component {

    public static instance: fireBase;
    onLoad() {
       
        if(fireBase.instance==null){
            
            fireBase.instance = this;
        }
        director.addPersistRootNode(this.node);
    }

    public LogEvent(event){
        if (firebaseLib){
            console.log("event: " + event)
            firebaseLib.trackingEvent(event);
        }

    }

}

