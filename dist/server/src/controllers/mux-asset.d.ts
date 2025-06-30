import { Context } from 'koa';
declare const _default: {
    find: (ctx: Context) => Promise<{
        items: any[];
        totalCount: number;
    }>;
    findOne: (ctx: Context) => Promise<any>;
    count: (ctx: Context) => Promise<number>;
    create: (ctx: Context) => Promise<import("@strapi/types/dist/modules/documents").AnyDocument>;
    update: (ctx: Context) => Promise<{
        ok: boolean;
    }>;
    del: (ctx: Context) => Promise<any>;
    getByUploadId: (ctx: Context) => Promise<any>;
    getByAssetId: (ctx: Context) => Promise<any>;
    getByPlaybackId: (ctx: Context) => Promise<any>;
};
export default _default;
