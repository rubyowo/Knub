"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooldownManager = void 0;
const CLEANUP_INTERVAL = 1000 * 60 * 5; // 5min
class CooldownManager {
    constructor() {
        this.cleanupTimeout = null;
        this.cooldowns = new Map();
        this.cleanupTimeout = setTimeout(() => this.cleanup(), CLEANUP_INTERVAL);
    }
    cleanup() {
        const now = Date.now();
        for (const [key, cdEnd] of this.cooldowns.entries()) {
            if (cdEnd < now)
                this.cooldowns.delete(key);
        }
        this.cleanupTimeout = setTimeout(() => this.cleanup(), CLEANUP_INTERVAL);
    }
    setCooldown(key, timeMs) {
        const cdEnd = Date.now() + timeMs;
        this.cooldowns.set(key, cdEnd);
    }
    isOnCooldown(key) {
        if (!this.cooldowns.has(key))
            return false;
        return this.cooldowns.get(key) >= Date.now();
    }
    getCooldownRemaining(key) {
        if (!this.isOnCooldown(key))
            return 0;
        return Math.max(0, this.cooldowns.get(key) - Date.now());
    }
    destroy() {
        if (this.cleanupTimeout) {
            clearTimeout(this.cleanupTimeout);
            this.cleanupTimeout = null;
        }
    }
}
exports.CooldownManager = CooldownManager;
