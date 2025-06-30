/// <reference types="koa" />
declare const _default: {
    'mux-asset': {
        find: (ctx: import("koa").Context) => Promise<{
            items: any[];
            totalCount: number;
        }>;
        findOne: (ctx: import("koa").Context) => Promise<any>;
        count: (ctx: import("koa").Context) => import("@strapi/types/dist/modules/documents/result/document-engine").Count;
        create: (ctx: import("koa").Context) => Promise<{
            debug: {
                requestBody: any;
                bodyType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
                bodyKeys: string[];
                title: any;
                titleType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
                titleLength: any;
            };
        }>;
        update: (ctx: import("koa").Context) => Promise<{
            ok: boolean;
        }>;
        del: (ctx: import("koa").Context) => Promise<any>;
        getByUploadId: (ctx: import("koa").Context) => Promise<any>;
        getByAssetId: (ctx: import("koa").Context) => Promise<any>;
        getByPlaybackId: (ctx: import("koa").Context) => Promise<any>;
    };
    mux: {
        postDirectUpload: (ctx: import("koa").Context) => Promise<void>;
        postRemoteUpload: (ctx: import("koa").Context) => Promise<void>;
        deleteMuxAsset: (ctx: import("koa").Context) => Promise<void>;
        muxWebhookHandler: (ctx: import("koa").Context) => Promise<void>;
        thumbnail: (ctx: import("koa").Context) => Promise<void>;
        storyboard: (ctx: import("koa").Context) => Promise<void>;
        signMuxPlaybackId: (ctx: import("koa").Context) => Promise<void>;
        textTrack: (ctx: import("koa").Context) => Promise<void>;
        animated: (ctx: import("koa").Context) => Promise<void>;
    };
    'mux-settings': {
        isConfigured: (ctx: import("koa").Context) => Promise<void>;
    };
};
export default _default;
