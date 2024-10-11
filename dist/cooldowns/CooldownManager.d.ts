/// <reference types="node" />
export declare class CooldownManager {
    protected cooldowns: Map<string, number>;
    protected cleanupTimeout: NodeJS.Timeout | null;
    constructor();
    protected cleanup(): void;
    setCooldown(key: string, timeMs: number): void;
    isOnCooldown(key: string): boolean;
    getCooldownRemaining(key: string): number;
    destroy(): void;
}
