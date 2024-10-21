import { DeepPartial } from "ts-essentials";
import { z } from "zod";
import { BasePluginData } from "../plugins/PluginData";
import { BasePluginType } from "../plugins/pluginTypes";
import { Awaitable } from "../utils";
import { MatchParams } from "./configUtils";
export declare const permissionLevelsSchema: z.ZodRecord<z.ZodString, z.ZodNumber>;
export type PermissionLevels = z.TypeOf<typeof permissionLevelsSchema>;
export declare const pluginBaseOptionsSchema: z.ZodObject<{
    config: z.ZodOptional<z.ZodUnknown>;
    replaceDefaultOverrides: z.ZodOptional<z.ZodBoolean>;
    overrides: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>;
}, "strict", z.ZodTypeAny, {
    config?: unknown;
    replaceDefaultOverrides?: boolean | undefined;
    overrides?: Record<string, unknown>[] | undefined;
}, {
    config?: unknown;
    replaceDefaultOverrides?: boolean | undefined;
    overrides?: Record<string, unknown>[] | undefined;
}>;
export declare const baseConfigSchema: z.ZodObject<{
    prefix: z.ZodOptional<z.ZodString>;
    levels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    plugins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        config: z.ZodOptional<z.ZodUnknown>;
        replaceDefaultOverrides: z.ZodOptional<z.ZodBoolean>;
        overrides: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>;
    }, "strict", z.ZodTypeAny, {
        config?: unknown;
        replaceDefaultOverrides?: boolean | undefined;
        overrides?: Record<string, unknown>[] | undefined;
    }, {
        config?: unknown;
        replaceDefaultOverrides?: boolean | undefined;
        overrides?: Record<string, unknown>[] | undefined;
    }>>>;
}, "strict", z.ZodTypeAny, {
    prefix?: string | undefined;
    levels?: Record<string, number> | undefined;
    plugins?: Record<string, {
        config?: unknown;
        replaceDefaultOverrides?: boolean | undefined;
        overrides?: Record<string, unknown>[] | undefined;
    }> | undefined;
}, {
    prefix?: string | undefined;
    levels?: Record<string, number> | undefined;
    plugins?: Record<string, {
        config?: unknown;
        replaceDefaultOverrides?: boolean | undefined;
        overrides?: Record<string, unknown>[] | undefined;
    }> | undefined;
}>;
export type BaseConfig = z.TypeOf<typeof baseConfigSchema>;
export interface PluginOptions<TPluginType extends BasePluginType> {
    config: TPluginType["config"];
    replaceDefaultOverrides?: boolean;
    overrides?: Array<PluginOverride<TPluginType>>;
}
export interface PluginOverride<TPluginType extends BasePluginType> extends PluginOverrideCriteria<TPluginType["customOverrideCriteria"]> {
    config?: DeepPartial<TPluginType["config"]>;
}
export interface PluginOverrideCriteria<TCustomOverrideCriteria> {
    channel?: string | string[] | null;
    category?: string | string[] | null;
    level?: string | string[] | null;
    user?: string | string[] | null;
    role?: string | string[] | null;
    thread?: string | string[] | null;
    is_thread?: boolean | null;
    thread_type?: "public" | "private" | null;
    all?: Array<PluginOverrideCriteria<TCustomOverrideCriteria>> | null;
    any?: Array<PluginOverrideCriteria<TCustomOverrideCriteria>> | null;
    not?: PluginOverrideCriteria<TCustomOverrideCriteria> | null;
    extra?: TCustomOverrideCriteria | null;
}
export type ConfigParserFn<TConfig> = (input: unknown) => Awaitable<TConfig>;
export type CustomOverrideCriteriaFunctions<TPluginData extends BasePluginData<any>> = {
    [KCriterion in keyof TPluginData["_pluginType"]["customOverrideCriteria"]]: (pluginData: TPluginData, matchParams: MatchParams<TPluginData["_pluginType"]["customOverrideMatchParams"]>, value: NonNullable<TPluginData["_pluginType"]["customOverrideCriteria"][KCriterion]>) => Awaitable<boolean>;
};
