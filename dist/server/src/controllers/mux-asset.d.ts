import { Context } from 'koa';
declare const _default: {
    find: (ctx: Context) => Promise<{
        items: any[];
        totalCount: number;
    }>;
    findOne: (ctx: Context) => Promise<any>;
    count: (ctx: Context) => import("@strapi/types/dist/modules/documents/result/document-engine").Count;
    create: (ctx: Context) => Promise<{
        debug: {
            requestBody: any;
            bodyType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
            bodyKeys: string[];
            title: any;
            titleType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
            titleLength: any;
        };
    }>;
    update: (ctx: Context) => Promise<{
        ok: boolean;
    }>;
    del: (ctx: Context) => Promise<any>;
    getByUploadId: (ctx: Context) => Promise<any>;
    getByAssetId: (ctx: Context) => Promise<any>;
    getByPlaybackId: (ctx: Context) => Promise<any>;
};
export default _default;
