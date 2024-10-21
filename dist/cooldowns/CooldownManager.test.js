"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const testUtils_1 = require("../testUtils");
const CooldownManager_1 = require("./CooldownManager");
(0, mocha_1.describe)("CooldownManager", () => {
    (0, mocha_1.it)("getCooldownRemaining() initial value", () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        cooldownManager.setCooldown("test", 1000);
        chai_1.assert.strictEqual(cooldownManager.getCooldownRemaining("test"), 1000);
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("getCooldownRemaining() after delay", async () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        cooldownManager.setCooldown("test", 1000);
        await (0, testUtils_1.sleep)(10);
        chai_1.assert.ok(cooldownManager.getCooldownRemaining("test") < 1000);
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("getCooldownRemaining() expired", async () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        cooldownManager.setCooldown("test", 10);
        await (0, testUtils_1.sleep)(20);
        chai_1.assert.strictEqual(cooldownManager.getCooldownRemaining("test"), 0);
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("getCooldownRemaining() unknown", () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        chai_1.assert.strictEqual(cooldownManager.getCooldownRemaining("nonexistent"), 0);
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("isOnCooldown() initial", () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        cooldownManager.setCooldown("test", 1000);
        chai_1.assert.ok(cooldownManager.isOnCooldown("test"));
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("isOnCooldown() after delay", async () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        cooldownManager.setCooldown("test", 1000);
        await (0, testUtils_1.sleep)(10);
        chai_1.assert.ok(cooldownManager.isOnCooldown("test"));
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("isOnCooldown() expired", async () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        cooldownManager.setCooldown("test", 10);
        await (0, testUtils_1.sleep)(20);
        chai_1.assert.ok(!cooldownManager.isOnCooldown("test"));
        cooldownManager.destroy();
    });
    (0, mocha_1.it)("isOnCooldown() unknown", () => {
        const cooldownManager = new CooldownManager_1.CooldownManager();
        chai_1.assert.ok(!cooldownManager.isOnCooldown("nonexistent"));
        cooldownManager.destroy();
    });
});
