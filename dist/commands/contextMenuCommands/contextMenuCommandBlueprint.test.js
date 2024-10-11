"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const contextMenuCommandBlueprint_1 = require("./contextMenuCommandBlueprint");
(0, mocha_1.describe)("Context menu command blueprints", () => {
    (0, mocha_1.describe)("MessageContextMenuCommandBlueprint", () => {
        (0, mocha_1.it)("(blueprint)", () => {
            const guildBlueprint = (0, contextMenuCommandBlueprint_1.guildPluginMessageContextMenuCommand)({
                name: "Test command",
                run({ interaction }) {
                    const result = true;
                },
            });
            const globalBlueprint = (0, contextMenuCommandBlueprint_1.globalPluginMessageContextMenuCommand)({
                name: "Test command",
                run({ interaction }) {
                    const result = true;
                },
            });
        });
        (0, mocha_1.it)("<TPluginData>()(blueprint)", () => {
            const guildBlueprint = (0, contextMenuCommandBlueprint_1.guildPluginMessageContextMenuCommand)()({
                name: "Test command",
                run({ pluginData, interaction }) {
                    const result1 = true;
                    const result2 = true;
                },
            });
            const globalBlueprint = (0, contextMenuCommandBlueprint_1.globalPluginMessageContextMenuCommand)()({
                name: "Test command",
                run({ pluginData, interaction }) {
                    const result1 = true;
                    const result2 = true;
                },
            });
        });
    });
    (0, mocha_1.describe)("UserContextMenuCommandBlueprint", () => {
        (0, mocha_1.it)("(blueprint)", () => {
            const guildBlueprint = (0, contextMenuCommandBlueprint_1.guildPluginUserContextMenuCommand)({
                name: "Test command",
                run({ interaction }) {
                    const result = true;
                },
            });
            const globalBlueprint = (0, contextMenuCommandBlueprint_1.guildPluginUserContextMenuCommand)({
                name: "Test command",
                run({ interaction }) {
                    const result = true;
                },
            });
        });
        (0, mocha_1.it)("<TPluginData>()(blueprint)", () => {
            const guildBlueprint = (0, contextMenuCommandBlueprint_1.guildPluginUserContextMenuCommand)()({
                name: "Test command",
                run({ pluginData, interaction }) {
                    const result1 = true;
                    const result2 = true;
                },
            });
            const globalBlueprint = (0, contextMenuCommandBlueprint_1.globalPluginUserContextMenuCommand)()({
                name: "Test command",
                run({ pluginData, interaction }) {
                    const result1 = true;
                    const result2 = true;
                },
            });
        });
    });
});
