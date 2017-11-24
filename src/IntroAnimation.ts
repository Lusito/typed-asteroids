/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { SceneAnimatorJSON } from "./sceneanimator/SceneAnimatorJson";

export let introAnimation: SceneAnimatorJSON = {
    "textStyles": {
        "default": { "fill": "#FFFFFF", "stroke": '#000000', "strokeThickness": 3, "fontFamily": "Verdana", "fontSize": 32, "align": "center" },
    },
    "paths": {},
    "queues": {
        "text": {
            "time": 0,
            "items": [
                { "type": "text", "x": 400, "y": 300, "style": "default", "text": "Lusito presents", "delay": 0 },
                { "type": "text", "x": 400, "y": 300, "style": "default", "text": "An Asteroids clone", "delay": 2 },
            ],
            "animations": [
                { "time": 0, "type": "text", "effect": "untype_instant" },
                {
                    "time": 1, "type": "text", "effect": "construct_type", "effectTime": 0.100,
                    "minRadius": 100, "maxRadius": 100,
                    "minAngle": -35, "maxAngle": -35,
                    "minCurveAngle": 25, "maxCurveAngle": 55
                },
                { "time": 2.5, "type": "text", "effect": "fade_out", "effectTime": 0.6 }
            ]
        }
    }
};
