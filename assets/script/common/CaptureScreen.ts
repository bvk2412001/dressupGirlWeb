import { _decorator, Camera, Component, Node, RenderTexture, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CaptureScreen')
export class CaptureScreen extends Component {
    

    public static captureScreenshot(camera: Camera, callback, delayTime: number, width, height, x, y) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let size = view.getVisibleSize();
        width = Math.round(width)
        height = Math.round(height)
        canvas.width = width;
        canvas.height = height;
        let rt = new RenderTexture();
        rt.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height,
        })
        
        camera.targetTexture = rt;



        const capture = () => {
            let arrayBuffer: ArrayBufferView = rt.readPixels(x, y, width, height);

            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = sRow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            const dataURL = canvas.toDataURL("image/jpeg", 0.2);
            if (callback) {
                callback(dataURL);
            }


        }
        //capture image after a bit of time, if not it is show blank only
        setTimeout(() => {
            capture();
        }, delayTime)

    }

    public static captureScreenshot1(camera: Camera, callback, delayTime: number, width, height, x, y) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let size = view.getVisibleSize();
        width = Math.round(width)
        height = Math.round(height)
        canvas.width = width;
        canvas.height = height;
        let rt = new RenderTexture();
        rt.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height,
        })
        
        camera.targetTexture = rt;



        const capture = () => {
            let arrayBuffer: ArrayBufferView = rt.readPixels(x, y, width, height);

            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = sRow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            const dataURL = canvas.toDataURL("image/png", 1);
            if (callback) {
                callback(dataURL);
            }


        }
        //capture image after a bit of time, if not it is show blank only
        setTimeout(() => {
            capture();
        }, delayTime)

    }
}


