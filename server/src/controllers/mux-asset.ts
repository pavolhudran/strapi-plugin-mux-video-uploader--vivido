import { Context } from 'koa';

import { MuxAssetUpdate } from '../content-types/mux-asset/types';
import { asset } from '../utils/resolve-mux-asset';
import { updateTextTracks } from '../utils/text-tracks';
import { ASSET_MODEL } from '../utils/types';

const search = (ctx: Context) => {
  const params = ctx.query;

  if (!params.sort) {
    params.sort = 'createdAt';
  }

  if (!params.order) {
    params.order = 'desc';
  }

  return strapi.documents(ASSET_MODEL).findMany(params);
};

const find = async (ctx: Context) => {
  const entities = await search(ctx);
  const totalCount = await count(ctx);

  const items = entities.map((entity: any) => entity);

  return { items, totalCount };
};

const findOne = async (ctx: Context) => {
  const { documentId } = ctx.params;

  return await asset(ASSET_MODEL, documentId, 'findOne', { filters: ctx.query });
};

const count = (ctx: Context) => {
  const params = ctx.query;

  return strapi.documents(ASSET_MODEL).count(params);
};

const create = async (ctx: Context) => {
  const body = ctx.request.body;

  // Return request data for debugging
  return {
    debug: {
      requestBody: body,
      bodyType: typeof body,
      bodyKeys: body ? Object.keys(body) : null,
      title: body?.title,
      titleType: typeof body?.title,
      titleLength: body?.title?.length,
    },
  };

  // Commented out for debugging - uncomment when fixed:
  // return await strapi.documents(ASSET_MODEL).create({ data: body });
};

const update = async (ctx: Context) => {
  const { documentId } = ctx.params;
  const muxAsset = await asset(ASSET_MODEL, documentId, 'findOne');

  if (!muxAsset) {
    ctx.notFound('mux-asset.notFound');
    return;
  }

  const { title, custom_text_tracks } = <MuxAssetUpdate>ctx.request.body;

  /** Let Mux's webhook handlers notify us of track changes */
  await updateTextTracks(muxAsset, custom_text_tracks);

  if (typeof title === 'string' && title) {
    await asset(ASSET_MODEL, documentId, 'update', { data: { title } });
  }

  return { ok: true };
};

const del = async (ctx: Context) => {
  const { documentId } = ctx.params;

  return await asset(ASSET_MODEL, documentId, 'delete');
};

/**
 * Get mux asset by upload ID
 */
const getByUploadId = async (ctx: Context) => {
  const { uploadId } = ctx.params;

  if (!uploadId) {
    return ctx.badRequest('Upload ID is required');
  }

  return await strapi.db.query(ASSET_MODEL).findOne({
    where: { upload_id: uploadId },
  });
};

/**
 * Get mux assets by asset ID
 */
const getByAssetId = async (ctx: Context) => {
  const { assetId } = ctx.params;

  if (!assetId) {
    return ctx.badRequest('Asset ID is required');
  }

  return await strapi.db.query(ASSET_MODEL).findOne({
    where: { asset_id: assetId },
  });
};

/**
 * Get mux asset by playback ID
 */
const getByPlaybackId = async (ctx: Context) => {
  const { playbackId } = ctx.params;

  if (!playbackId) {
    return ctx.badRequest('Playback ID is required');
  }

  return await strapi.db.query(ASSET_MODEL).findOne({
    where: { playback_id: playbackId },
  });
};

export default {
  find,
  findOne,
  count,
  create,
  update,
  del,
  getByUploadId,
  getByAssetId,
  getByPlaybackId,
};
