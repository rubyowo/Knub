"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
(0, mocha_1.describe)("pluginUtils", () => {
    (0, mocha_1.it)("PluginPublicInterface type", () => {
        const myPlugin = {
            name: "my-plugin",
            configParser: () => ({}),
            public() {
                return {
                    someFn: 5,
                };
            },
        };
        const result1 = true;
        const result2 = false;
    });
});
