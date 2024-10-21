import { BasePluginData } from "../plugins/PluginData";
import { BasePluginType } from "../plugins/pluginTypes";
import { CustomOverrideCriteriaFunctions, PluginOptions, PluginOverride } from "./configTypes";
export interface MatchParams<TExtra extends Record<string, unknown> = Record<string, unknown>> {
    level?: number | null;
    userId?: string | null;
    memberRoles?: string[] | null;
    channelId?: string | null;
    categoryId?: string | null;
    threadId?: string | null;
    isThread?: boolean | null;
    extra?: TExtra;
}
/**
 * Basic deep merge with support for specifying merge "rules" with key prefixes.
 * For example, prefixing the key of a property containing an array with "+" would concat the two arrays, while
 * a prefix of "-" would calculate the difference ("remove items").
 *
 * Using '*' as a key will set that value to all known properties in the config at that time.
 * This is mostly used for permissions.
 *
 * @param {T} target
 * @param {T} sources
 * @returns {T}
 */
export declare function mergeConfig<T extends Record<string, unknown>>(...sources: any[]): T;
/**
 * Returns matching plugin options for the specified matchParams based on overrides
 */
export declare function getMatchingPluginConfig<TPluginType extends BasePluginType, TPluginData extends BasePluginData<TPluginType> = BasePluginData<TPluginType>, TPluginOptions extends PluginOptions<TPluginData["_pluginType"]> = PluginOptions<TPluginData["_pluginType"]>>(pluginData: TPluginData, pluginOptions: TPluginOptions, matchParams: MatchParams<TPluginData["_pluginType"]["customOverrideMatchParams"]>, customOverrideCriteriaFunctions?: CustomOverrideCriteriaFunctions<TPluginData>): Promise<TPluginData["_pluginType"]["config"]>;
/**
 * Each criteria "block" ({ level: "...", channel: "..." }) matches only if *all* criteria in it match.
 */
export declare function evaluateOverrideCriteria<TPluginData extends BasePluginData<any>>(pluginData: TPluginData, criteria: PluginOverride<TPluginData["_pluginType"]>, matchParams: MatchParams, customOverrideCriteriaFunctions?: CustomOverrideCriteriaFunctions<TPluginData>): Promise<boolean>;
