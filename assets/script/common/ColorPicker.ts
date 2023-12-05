import { _decorator, Color, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorPicker')
export class ColorPicker extends Component {
    public static SKIN_COLOR_LIST: Array<Color> = [
        new Color(255, 255, 255), 
        new Color(254, 233, 228), 
        new Color(240, 215, 210), 
        new Color(255, 223, 217), 
        new Color(255, 217, 217), 
        new Color(246, 200, 200), 
        new Color(246, 190, 190), 
        new Color(240, 180, 180),
        new Color(230, 187, 142),
        new Color(221, 166, 108),
        new Color(201, 141, 77),
        new Color(216, 139, 56),
        new Color(192, 112, 41),
        new Color(176, 91, 39),
        new Color(160, 78, 36),

        new Color(138, 88, 54),
        new Color(138, 88, 54),
        new Color(120, 70, 36),
        new Color(100, 52, 20),
        new Color(86, 42, 16),
        new Color(70, 34, 15),
        new Color(50, 26, 13),

        new Color(242, 108, 78),
        new Color(246, 142, 85),
        new Color(251, 175, 92),
        new Color(255, 244, 103),
        new Color(172, 211, 114),
        new Color(59, 184, 120),
        new Color(26, 187, 180),

        new Color(237, 32, 36),
        new Color(215, 223, 35),
        new Color(105, 190, 70),
        new Color(111, 204, 221),
        new Color(57, 83, 164),
        new Color(185, 82, 159),
        new Color(136, 1, 140),

        new Color(110, 207, 246),
        new Color(126, 167, 216),
        new Color(132, 147, 202),
        new Color(136, 130, 190),
        new Color(161, 135, 200),
        new Color(188, 141, 191),
        new Color(245, 152, 157),
    ]


    public static HAIR_COLOR_LIST:Array<Color> = [
        new Color(255,255,255),
        new Color(210,180,254),
        new Color(159,244,230),
        new Color(255,201,224),
        new Color(255,244,191),
        new Color(208,237,255),
        new Color(250,250,250),
        new Color(250,250,250),

        new Color(250,250,250),
        new Color(250,250,250),
        new Color(250,250,250),
        new Color(40,40,40),
        new Color(250,250,250),
        new Color(255,181,202),
        new Color(176,191,254),
        new Color(187,141,108),

        new Color(250,250,250),
        new Color(250,250,250),
        new Color(250,250,250),
        new Color(40,40,40),
        new Color(250,250,250),
        new Color(255,181,202),
        new Color(176,191,254),
        new Color(187,141,108),
        

        
    ]
    public static SUB_HAIR_COLOR_LIST:Array<Color> = [
        new Color(155,255,255),
        new Color(130,90,190),
        new Color(68,189,194),
        new Color(237,106,184),
        new Color(1255,188,103),
        new Color(64,146,214),
        new Color(210,180,254),
        new Color(159,244,230),

        new Color(255,201,224),
        new Color(255,244,191),
        new Color(208,237,255),
        new Color(20,20,20),
        new Color(215,215,215),
        new Color(255,81,119),
        new Color(91,111,197),
        new Color(151,100,68),

        new Color(217,173,136),
        new Color(217,147,136),
        new Color(252,238,210),
        new Color(255,188,103),
        new Color(206,206,206),
        new Color(159,244,230),
        new Color(255,181,202),
        new Color(101,96,94),
    ]
}


