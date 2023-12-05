import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataSaveItem')
export class DataSaveItem extends Component {
    public type: string
    public possision: Vec3
    public scale: Vec3
    public dataDoll = null
    public message = null
    public path = ""


    constructor(type, possision, scale, dataDoll = null, message = null, path = null) {
        super()

        this.type = type
        this.possision = possision
        this.scale = scale
        if (dataDoll)
            this.dataDoll = dataDoll
        if(message)
            this.message = message
        if(path)
            this.path = path
    }
}


