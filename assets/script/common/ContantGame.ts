import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ContantGame')
export class ContantGame extends Component {
    public static web_sence = "Web"
    public static mobile_sence = "Mobile"


    public static mobile_width = 1080
    public static mobile_height = 1920

    public static web_width = 1920
    public static web_height = 1080

    
}


