"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const testUtils_1 = require("../testUtils");
const LockManager_1 = require("./LockManager");
(0, mocha_1.describe)("LockManager", () => {
    (0, mocha_1.it)("simple lock", async () => {
        const numbers = [];
        const lockManager = new LockManager_1.LockManager();
        const lockName = "number-lock";
        const process1 = (async () => {
            const lock = await lockManager.acquire(lockName);
            numbers.push(1);
            await (0, testUtils_1.sleep)(1);
            numbers.push(2);
            lock.unlock();
        })();
        const process2 = (async () => {
            const lock = await lockManager.acquire(lockName);
            numbers.push(3);
            await (0, testUtils_1.sleep)(1);
            numbers.push(4);
            lock.unlock();
        })();
        const process3 = (async () => {
            numbers.push(5);
            numbers.push(6);
        })();
        await Promise.all([process1, process2, process3]);
        chai_1.assert.deepStrictEqual(numbers, [5, 6, 1, 2, 3, 4]);
        await lockManager.destroy();
    });
    (0, mocha_1.it)("expiring lock", async () => {
        const lockManager = new LockManager_1.LockManager(50);
        const lockName = "test-lock";
        let unlockedManually = false;
        const lock = await lockManager.acquire(lockName);
        setTimeout(() => {
            unlockedManually = true;
            lock.unlock();
        }, 100);
        const lock2 = await lockManager.acquire(lockName);
        chai_1.assert.strictEqual(unlockedManually, false);
        lock2.unlock();
        await lockManager.destroy();
    });
    (0, mocha_1.it)("combined locks", async () => {
        const lockManager = new LockManager_1.LockManager();
        const lock1Name = "test-lock-1";
        const lock2Name = "test-lock-2";
        let lock1Unlocked = false;
        let lock2Unlocked = false;
        const lock1 = await lockManager.acquire(lock1Name);
        const lock2 = await lockManager.acquire(lock2Name);
        setTimeout(() => {
            lock1Unlocked = true;
            lock1.unlock();
        }, 10);
        setTimeout(() => {
            lock2Unlocked = true;
            lock2.unlock();
        }, 50);
        let combinedLockUnlocked = false;
        // We should only be able to acquire this lock after lock1 and lock2 are *both* unlocked
        const combinedLock = await lockManager.acquire([lock1Name, lock2Name]);
        chai_1.assert.strictEqual(lock1Unlocked, true);
        chai_1.assert.strictEqual(lock2Unlocked, true);
        setTimeout(() => {
            combinedLockUnlocked = true;
            combinedLock.unlock();
        }, 10);
        // We should only be able to acquire either of the individual locks
        // after the combined lock encompassing them both is unlocked
        await Promise.race([
            lockManager.acquire(lock1Name).then((l) => l.unlock()),
            lockManager.acquire(lock2Name).then((l) => l.unlock()),
        ]);
        chai_1.assert.strictEqual(combinedLockUnlocked, true);
        await lockManager.destroy();
    });
    (0, mocha_1.it)("acquiring a lock throws an error if lock is destroyed", (done) => {
        (async () => {
            const lockName = "lock";
            const lockManager = new LockManager_1.LockManager(60 * 1000);
            // 1. Acquire lock
            await lockManager.acquire(lockName);
            // 2. Attempt to acquire the lock again
            lockManager.acquire(lockName).catch((err) => {
                done();
            });
            // 3. Destroy the lock manager (and locks) before the second acquire() succeeds
            lockManager.destroy();
        })();
    });
});
