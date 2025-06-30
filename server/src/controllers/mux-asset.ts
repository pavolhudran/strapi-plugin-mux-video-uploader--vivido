import { Context } from 'koa';

import { MuxAssetUpdate } from '../content-types/mux-asset/types';
import { asset } from '../utils/resolve-mux-asset';
import { updateTextTracks } from '../utils/text-tracks';
import { ASSET_MODEL } from '../utils/types';

const search = async (ctx: Context) => {
  try {
    const params = ctx.query;

    if (!params.sort) {
      params.sort = 'createdAt';
    }

    if (!params.order) {
      params.order = 'desc';
    }

    return await strapi.documents(ASSET_MODEL).findMany(params);
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

const find = async (ctx: Context) => {
  try {
    const entities = await search(ctx);
    const totalCount = await count(ctx);

    const items = entities.map((entity: any) => entity);

    return { items, totalCount };
  } catch (error) {
    console.error('Find error:', error);
    throw error;
  }
};

const findOne = async (ctx: Context) => {
  try {
    const { documentId } = ctx.params;

    return await asset(ASSET_MODEL, documentId, 'findOne', { filters: ctx.query });
  } catch (error) {
    console.error('FindOne error:', error);
    throw error;
  }
};

const count = async (ctx: Context) => {
  try {
    const params = ctx.query;

    return await strapi.documents(ASSET_MODEL).count(params);
  } catch (error) {
    console.error('Count error:', error);
    throw error;
  }
};

const create = async (ctx: Context) => {
  const body = ctx.request.body;

  try {
    const result = await strapi.documents(ASSET_MODEL).create({ data: body });
    return result;
  } catch (error) {
    console.error('Create error:', error);
    throw error;
  }
};

const update = async (ctx: Context) => {
  try {
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
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

const del = async (ctx: Context) => {
  try {
    const { documentId } = ctx.params;

    return await asset(ASSET_MODEL, documentId, 'delete');
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

/**
 * Get mux asset by upload ID
 */
const getByUploadId = async (ctx: Context) => {
  try {
    const { uploadId } = ctx.params;

    if (!uploadId) {
      return ctx.badRequest('Upload ID is required');
    }

    return await strapi.db.query(ASSET_MODEL).findOne({
      where: { upload_id: uploadId },
    });
  } catch (error) {
    console.error('GetByUploadId error:', error);
    throw error;
  }
};

/**
 * Get mux assets by asset ID
 */
const getByAssetId = async (ctx: Context) => {
  try {
    const { assetId } = ctx.params;

    if (!assetId) {
      return ctx.badRequest('Asset ID is required');
    }

    return await strapi.db.query(ASSET_MODEL).findOne({
      where: { asset_id: assetId },
    });
  } catch (error) {
    console.error('GetByAssetId error:', error);
    throw error;
  }
};

/**
 * Get mux asset by playback ID
 */
const getByPlaybackId = async (ctx: Context) => {
  try {
    const { playbackId } = ctx.params;

    if (!playbackId) {
      return ctx.badRequest('Playback ID is required');
    }

    return await strapi.db.query(ASSET_MODEL).findOne({
      where: { playback_id: playbackId },
    });
  } catch (error) {
    console.error('GetByPlaybackId error:', error);
    throw error;
  }
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
