"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfigSchema = exports.pluginBaseOptionsSchema = exports.permissionLevelsSchema = void 0;
const zod_1 = require("zod");
exports.permissionLevelsSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.number().int(), {});
exports.pluginBaseOptionsSchema = zod_1.z.strictObject({
    config: zod_1.z.unknown().optional(),
    replaceDefaultOverrides: zod_1.z.boolean().optional(),
    overrides: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())).optional(),
});
exports.baseConfigSchema = zod_1.z.strictObject({
    prefix: zod_1.z.string().optional(),
    levels: exports.permissionLevelsSchema.optional(),
    plugins: zod_1.z.record(zod_1.z.string(), exports.pluginBaseOptionsSchema).optional(),
});
