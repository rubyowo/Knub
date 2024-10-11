"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const EventListenerBlueprint_1 = require("./EventListenerBlueprint");
(0, mocha_1.describe)("guildPluginEventListener() helper", () => {
    (0, mocha_1.it)("(blueprint)", () => {
        const blueprint1 = (0, EventListenerBlueprint_1.guildPluginEventListener)({
            event: "messageCreate",
            listener() { },
        });
        (0, chai_1.expect)(blueprint1.event).to.equal("messageCreate");
        (0, chai_1.expect)(blueprint1.listener).to.not.equal(undefined);
        (0, chai_1.expect)(blueprint1.allowSelf).to.equal(undefined);
    });
    (0, mocha_1.it)("(blueprint) guild event argument inference", () => {
        (0, EventListenerBlueprint_1.guildPluginEventListener)({
            event: "messageCreate",
            listener({ args }) {
                // Test type inference
                const result = true;
            },
        });
        // More type checks
        (0, EventListenerBlueprint_1.guildPluginEventListener)({
            event: "channelUpdate",
            listener({ args }) {
                // Test type inference
                const result = true;
            },
        });
        (0, EventListenerBlueprint_1.guildPluginEventListener)({
            event: "typingStart",
            listener({ args }) {
                // Test type inference
                const result = true;
            },
        });
    });
    (0, mocha_1.it)("<TPluginType>()(blueprint)", () => {
        const blueprint = (0, EventListenerBlueprint_1.guildPluginEventListener)()({
            event: "messageCreate",
            listener() { },
        });
        (0, chai_1.expect)(blueprint.event).to.equal("messageCreate");
        (0, chai_1.expect)(blueprint.listener).to.not.equal(undefined);
        (0, chai_1.expect)(blueprint.allowSelf).to.equal(undefined);
    });
});
(0, mocha_1.describe)("globalPluginEventListener() helper", () => {
    (0, mocha_1.it)("(blueprint)", () => {
        const blueprint = (0, EventListenerBlueprint_1.globalPluginEventListener)({
            event: "messageCreate",
            listener() { },
        });
        (0, chai_1.expect)(blueprint.event).to.equal("messageCreate");
        (0, chai_1.expect)(blueprint.listener).to.not.equal(undefined);
        (0, chai_1.expect)(blueprint.allowSelf).to.equal(undefined);
    });
    (0, mocha_1.it)("(blueprint) guild event argument inference", () => {
        (0, EventListenerBlueprint_1.globalPluginEventListener)({
            event: "messageCreate",
            listener({ args }) {
                // Test type inference
                const result = true;
            },
        });
        // More type checks
        (0, EventListenerBlueprint_1.globalPluginEventListener)({
            event: "channelUpdate",
            listener({ args }) {
                // Test type inference
                const result = true;
            },
        });
        (0, EventListenerBlueprint_1.globalPluginEventListener)({
            event: "typingStart",
            listener({ args }) {
                // Test type inference
                const result = true;
            },
        });
    });
    (0, mocha_1.it)("<TPluginType>()(blueprint)", () => {
        const blueprint = (0, EventListenerBlueprint_1.globalPluginEventListener)()({
            event: "messageCreate",
            listener() { },
        });
        (0, chai_1.expect)(blueprint.event).to.equal("messageCreate");
        (0, chai_1.expect)(blueprint.listener).to.not.equal(undefined);
        (0, chai_1.expect)(blueprint.allowSelf).to.equal(undefined);
    });
});
