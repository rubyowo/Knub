"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const knub_command_manager_1 = require("knub-command-manager");
const mocha_1 = require("mocha");
const messageCommandUtils_1 = require("./messageCommandUtils");
const cmdContext = {};
(0, mocha_1.describe)("messageCommandUtils", () => {
    (0, mocha_1.it)("getCommandSignature() works with commands without signatures", async () => {
        const manager = new knub_command_manager_1.CommandManager({ prefix: "!" });
        manager.add("foo");
        const matchedCommand = await manager.findMatchingCommand("!foo", cmdContext);
        if ((0, knub_command_manager_1.isError)(matchedCommand) || matchedCommand == null)
            chai_1.assert.fail();
        (0, messageCommandUtils_1.getMessageCommandSignature)(matchedCommand);
    });
    (0, mocha_1.it)("ArgsFromSignature basic functionality", () => {
        const signature = {
            foo: (0, knub_command_manager_1.string)(),
            bar: (0, knub_command_manager_1.number)(),
        };
        const result1 = true;
        const result2 = true;
    });
    (0, mocha_1.it)("ArgsFromSignature rest parameters", () => {
        const signature = {
            foo: (0, knub_command_manager_1.string)({ rest: true }),
            bar: (0, knub_command_manager_1.number)({ rest: true }),
        };
        const result1 = true;
        const result2 = true;
    });
});
