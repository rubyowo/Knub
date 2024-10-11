"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const slashCommandBlueprint_1 = require("./slashCommandBlueprint");
const slashCommandOptions_1 = require("./slashCommandOptions");
(0, mocha_1.describe)("Slash command blueprints", () => {
    (0, mocha_1.describe)("typedGuildSlashCommand()", () => {
        (0, mocha_1.it)("(blueprint)", () => {
            const blueprint = (0, slashCommandBlueprint_1.guildPluginSlashCommand)({
                name: "cmd",
                description: "Blah blah",
                signature: [
                    slashCommandOptions_1.slashOptions.string({ name: "foo", description: "", required: true }),
                    slashCommandOptions_1.slashOptions.number({ name: "bar", description: "" }),
                ],
                run({ options }) {
                    const result = true;
                },
            });
        });
        (0, mocha_1.it)("<TPluginType>()(blueprint)", () => {
            const blueprint = (0, slashCommandBlueprint_1.guildPluginSlashCommand)()({
                name: "cmd",
                description: "Blah blah",
                signature: [
                    slashCommandOptions_1.slashOptions.string({ name: "foo", description: "", required: true }),
                    slashCommandOptions_1.slashOptions.number({ name: "bar", description: "" }),
                ],
                run({ pluginData, options }) {
                    const result1 = true;
                    const result2 = true;
                },
            });
        });
    });
});
