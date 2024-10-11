"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const slashCommandOptions_1 = require("./slashCommandOptions");
(0, mocha_1.describe)("slashCommandUtils", () => {
    (0, mocha_1.it)("OptionsFromSignature basic functionality", () => {
        const signature = [
            slashCommandOptions_1.slashOptions.string({ name: "required_str", description: "", required: true }),
            slashCommandOptions_1.slashOptions.string({ name: "optional_str", description: "" }),
        ];
        const test1 = true;
        const test2 = false;
        const test3 = true;
        const test4 = true;
    });
});
