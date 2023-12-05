import { _decorator, Component, director, Node, Prefab } from 'cc';
import { ContantGame } from './ContantGame';
import { Tools } from './Tools';
import { Config } from './Config';
import { Native } from './Enum';
import { StaticData } from './StaticData';
const { ccclass, property } = _decorator;

@ccclass('Context')
export class Context extends Component {
    public static ins: Context
    public locale = "";
    public avatar = "0";
    private localeURL = 'https://www.cloudflare.com/cdn-cgi/trace23';

    user = null

    getLocale() {
        this.getLocaleManual((data) => {
            let startIndex = data.search('loc');
            let loc = data.substring(startIndex + 4, startIndex + 6).toLowerCase();
            //convert from location to language
            var countryCode = loc;
            var lang = 'en';
            if (countryCode == null || countryCode == undefined || countryCode.length == 0 || countryCode == 'undefined') {
                countryCode = 'us';
            }
            if (countryCode == 'vn') {
                lang = 'vi'
            }
            this.SetDataUser({ locale: countryCode, language: lang })
        })
    }

    private getLocaleManual(callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        }
        xhr.open('GET', this.localeURL, true);
        xhr.send('');
    }

    public SetDataUser(data) {

        if (data.locale) {
            this.locale = data.locale.toLowerCase();
        }
    }

    public static getInstance() {
        if (this.ins == null)
            this.ins = new Context()
        return this.ins
    }

    public prefabs = [
        "prefab/doll",
        "prefab/itemInsence",
        "prefab/itemGallery",
        "prefab/itemGalleryMobile"
    ];


    public startGame() {
        this.loadRes()
        if (this.indexLoadRes == 5) {
            if (Config.native == Native.Web) {
                director.loadScene(ContantGame.web_sence)
            }
            else {
                director.loadScene(ContantGame.mobile_sence)
            }

        }
        else {
            setTimeout(() => {
                this.startGame()
            }, 100);
        }
    }

    indexLoadRes = 0
    isLoadRes = false
    public loadRes() {
        if (this.isLoadRes == false) {
            this.isLoadRes = true
            this.prefabs.forEach((name, index) => {
                Tools.loadPrefab(name, (err, prefab: Prefab) => {
                    if (err) {

                    }
                    else {
                        switch (name) {
                            case "prefab/doll":
                                StaticData.doll = prefab
                                this.indexLoadRes++
                                break;

                            case "prefab/itemInsence":
                                StaticData.itemInSence = prefab
                                this.indexLoadRes++
                                break;
                            case "prefab/itemGallery":
                                StaticData.itemGallery = prefab
                                this.indexLoadRes++
                                break;
                            case "prefab/itemGalleryMobile":
                                StaticData.itemGalleryMobile = prefab
                                this.indexLoadRes++
                                break;
                        }
                    }

                })
            })
        }
    }
}


