/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { SceneAnimatorJSON } from "./sceneanimator/SceneAnimatorJSON";

export const creditsAnimation: SceneAnimatorJSON = {
    textStyles: {
        app_name: {
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 32,
            align: "center",
        },
        title_left: {
            fill: "#F8BB08",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 24,
            align: "right",
        },
        title_right: {
            fill: "#F8BB08",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 24,
            align: "left",
        },
        title_center: {
            fill: "#F8BB08",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 24,
            align: "center",
        },
        text_center: {
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 24,
            align: "center",
        },
        text_left: {
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 24,
            align: "right",
        },
        text_right: {
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: "Verdana",
            fontSize: 24,
            align: "left",
        },
    },
    paths: {
        text: {
            type: "linear",
            destinations: [
                { x: 400, y: 400, speed: 30 },
                { x: 400, y: 20, speed: 30 },
            ],
        },
    },
    queues: {
        text: {
            time: 0,
            items: [
                { type: "text", path: "text", style: "app_name", text: "Lusito's Asteroids Clone", delay: 0 },

                { type: "text", path: "text", group: "title", style: "title_center", text: "Development", delay: 3 },
                { type: "text", path: "text", style: "text_center", text: "Santo Pfingsten", delay: 1.35 },

                { type: "text", path: "text", group: "title", style: "title_center", text: "2D Artwork", delay: 3.3 },
                { type: "sprite", path: "text", resource: "xiller", scale: 0.5, delay: 2.35 },

                {
                    type: "text",
                    path: "text",
                    group: "title",
                    style: "title_center",
                    text: "Sound Effects",
                    delay: 3.3,
                },
                { type: "text", path: "text", style: "text_left", text: "Bart Kelsey  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  Bliss", delay: 0 },
                { type: "text", path: "text", style: "text_left", text: "broumbroum  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  inferno", delay: 0 },
                { type: "text", path: "text", style: "text_left", text: "RunnerPack  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  Simon_Lacelle", delay: 0 },
                { type: "text", path: "text", style: "text_center", text: "THE_bizniss", delay: 1.35 },

                { type: "text", path: "text", group: "title", style: "title_center", text: "Music", delay: 3.3 },
                { type: "text", path: "text", style: "text_left", text: "Joost Egelie  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  Pogotron", delay: 0 },
                { type: "text", path: "text", style: "text_center", text: "lucasgonze", delay: 1.35 },

                {
                    type: "text",
                    path: "text",
                    group: "title",
                    style: "title_center",
                    text: "Used Libraries",
                    delay: 3.3,
                },
                { type: "text", path: "text", style: "text_left", text: "PixiJS v5  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  pixi-sound", delay: 0 },
                { type: "text", path: "text", style: "text_left", text: "typed-ecstasy  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  typed-signals", delay: 0 },

                {
                    type: "text",
                    path: "text",
                    group: "title",
                    style: "title_center",
                    text: "Special Thanks",
                    delay: 3.3,
                },
                { type: "text", path: "text", style: "text_left", text: "www.FreeSound.org  ", delay: 1.35 },
                { type: "text", path: "text", style: "text_right", text: "  www.Jamendo.com", delay: 0 },
                { type: "text", path: "text", style: "text_center", text: "www.OpenGameArt.org", delay: 1.35 },
            ],
            animations: [
                {
                    time: 0,
                    type: "text",
                    effect: "construct",
                    effectTime: 1,
                    group: "title",
                    minRadius: 100,
                    maxRadius: 3,
                    minAngle: 45,
                    maxAngle: 135,
                    minCurveAngle: 45,
                    maxCurveAngle: 135,
                },
                { time: 0, type: "text", effect: "untype_instant" },
                {
                    time: 1,
                    type: "text",
                    effect: "construct_type",
                    effectTime: 0.1,
                    minRadius: 100,
                    maxRadius: 100,
                    minAngle: -35,
                    maxAngle: -35,
                    minCurveAngle: 25,
                    maxCurveAngle: 55,
                },
                { time: 0, type: "sprite", effect: "hide" },
                { time: 1, type: "sprite", effect: "scale_in", effectTime: 1 },

                { time: 9, type: "text", effect: "fade_out", effectTime: 2, group: "*" },
                { time: 9, type: "sprite", effect: "fade_out", effectTime: 2, group: "*" },
            ],
        },
    },
};
