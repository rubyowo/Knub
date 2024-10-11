"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const eventFilters_1 = require("./eventFilters");
(0, mocha_1.describe)("Event filters", () => {
    (0, mocha_1.it)("onlyGuild", () => {
        const filter = (0, eventFilters_1.onlyGuild)();
        const guild = {};
        // Accepts same guild
        const result1 = filter("messageCreate", {
            args: {
                message: {
                    channel: {
                        guild,
                    },
                },
            },
            pluginData: {
                context: "guild",
                guild,
            },
        });
        chai_1.assert.ok(result1);
        // Rejects different guild
        const guild2 = {};
        const result2 = filter("messageCreate", {
            args: {
                message: {
                    channel: {
                        guild2,
                    },
                },
            },
            pluginData: {
                context: "guild",
                guild,
            },
        });
        chai_1.assert.ok(!result2);
        // Rejects global plugins
        const result3 = filter("messageCreate", {
            args: {
                message: {
                    channel: {
                        guild,
                    },
                },
            },
            pluginData: {
                context: "global",
            },
        });
        chai_1.assert.ok(!result3);
    });
});
