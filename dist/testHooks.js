"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaHooks = void 0;
exports.mochaHooks = {
    beforeAll() {
        process.on("uncaughtException", (err) => {
            throw err;
        });
        process.on("unhandledRejection", (err, promise) => {
            throw err;
        });
    },
};
