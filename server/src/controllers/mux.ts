import axios from 'axios';
import { Context } from 'koa';
import { z } from 'zod';

import { StoredTextTrack, UploadConfig, UploadDataWithoutFile } from '../../../types/shared-types';
import { Config, getService } from '../utils';
import { parseRequest } from '../utils/parse-json-body';
import { resolveMuxAsset } from '../utils/resolve-mux-asset';
import { storeTextTracks } from '../utils/text-tracks';
import { ASSET_MODEL, TEXT_TRACK_MODEL } from '../utils/types';

const processWebhookEvent = async (webhookEvent: any) => {
  const { type, data } = webhookEvent;

  switch (type) {
    case 'video.upload.asset_created': {
      try {
        const muxAsset = await resolveMuxAsset({ upload_id: data.id });
        return [
          muxAsset.id,
          {
            data: { asset_id: data.asset_id },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.upload.asset_created webhook - no matching upload_id: ${data.id}`);
        return undefined;
      }
    }
    case 'video.asset.ready': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.id });
        return [
          muxAsset.id,
          {
            data: {
              playback_id: data.playback_ids[0].id,
              duration: data.duration,
              aspect_ratio: data.aspect_ratio,
              isReady: true,
              asset_data: data,
            },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.asset.ready webhook - no matching asset_id: ${data.id}`);
        return undefined;
      }
    }
    // Handle asset updated webhook (e.g., when static renditions status changes)
    case 'video.asset.updated': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.id });
        return [
          muxAsset.id,
          {
            data: {
              asset_data: data,
            },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.asset.updated webhook - no matching asset_id: ${data.id}`);
        return undefined;
      }
    }
    // Handle legacy static_renditions.ready webhook (deprecated mp4_support)
    case 'video.asset.static_renditions.ready': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.id });
        return [
          muxAsset.id,
          {
            data: {
              asset_data: data,
            },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.asset.static_renditions.ready webhook - no matching asset_id: ${data.id}`);
        return undefined;
      }
    }
    // Handle new static_rendition.ready webhook (static_renditions API)
    case 'video.asset.static_rendition.ready': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.asset_id });
        // Fetch the complete asset data from Mux API to get updated static renditions
        const completeAssetData = await getService('mux').getAssetById(data.asset_id);
        return [
          muxAsset.id,
          {
            data: {
              asset_data: completeAssetData,
            },
          },
        ] as const;
      } catch (error) {
        console.log(
          `INFO: Skipping video.asset.static_rendition.ready webhook - no matching asset_id: ${data.asset_id}`
        );
        return undefined;
      }
    }
    // Handle static_rendition.created webhook
    case 'video.asset.static_rendition.created': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.asset_id });
        // Fetch the complete asset data from Mux API to get updated static renditions
        const completeAssetData = await getService('mux').getAssetById(data.asset_id);
        return [
          muxAsset.id,
          {
            data: {
              asset_data: completeAssetData,
            },
          },
        ] as const;
      } catch (error) {
        console.log(
          `INFO: Skipping video.asset.static_rendition.created webhook - no matching asset_id: ${data.asset_id}`
        );
        return undefined;
      }
    }
    // Handle static_rendition.errored webhook
    case 'video.asset.static_rendition.errored': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.asset_id });
        // Fetch the complete asset data from Mux API to get updated static renditions
        const completeAssetData = await getService('mux').getAssetById(data.asset_id);
        return [
          muxAsset.id,
          {
            data: {
              asset_data: completeAssetData,
            },
          },
        ] as const;
      } catch (error) {
        console.log(
          `INFO: Skipping video.asset.static_rendition.errored webhook - no matching asset_id: ${data.asset_id}`
        );
        return undefined;
      }
    }
    // Handle static_rendition.skipped webhook
    case 'video.asset.static_rendition.skipped': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.asset_id });
        // Fetch the complete asset data from Mux API to get updated static renditions
        const completeAssetData = await getService('mux').getAssetById(data.asset_id);
        return [
          muxAsset.id,
          {
            data: {
              asset_data: completeAssetData,
            },
          },
        ] as const;
      } catch (error) {
        console.log(
          `INFO: Skipping video.asset.static_rendition.skipped webhook - no matching asset_id: ${data.asset_id}`
        );
        return undefined;
      }
    }
    // Handle static_rendition.deleted webhook
    case 'video.asset.static_rendition.deleted': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.asset_id });
        // Fetch the complete asset data from Mux API to get updated static renditions
        const completeAssetData = await getService('mux').getAssetById(data.asset_id);
        return [
          muxAsset.id,
          {
            data: {
              asset_data: completeAssetData,
            },
          },
        ] as const;
      } catch (error) {
        console.log(
          `INFO: Skipping video.asset.static_rendition.deleted webhook - no matching asset_id: ${data.asset_id}`
        );
        return undefined;
      }
    }
    case 'video.upload.errored': {
      try {
        const muxAsset = await resolveMuxAsset({ upload_id: data.id });
        return [
          muxAsset.id,
          {
            data: {
              error_message: `There was an unexpected error during upload`,
            },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.upload.errored webhook - no matching upload_id: ${data.id}`);
        return undefined;
      }
    }
    case 'video.asset.errored': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.id });
        return [
          muxAsset.id,
          {
            data: {
              error_message: `${data.errors.type}: ${data.errors.messages[0] || ''}`,
            },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.asset.errored webhook - no matching asset_id: ${data.id}`);
        return undefined;
      }
    }
    default:
      return undefined;
  }
};

/**
 * Get a thumbnail from a video
 * @docs https://www.mux.com/docs/guides/get-images-from-a-video
 * @param {string} documentId - The ID of the video to get the thumbnail from
 * @param {string} token - The token to use to get the thumbnail
 * @param {string} time - The time of the thumbnail to get
 * @param {string} width - The width of the thumbnail to get
 * @param {string} height - The height of the thumbnail to get
 * @param {string} rotate - The rotation of the thumbnail to get
 * @param {string} fit_mode - The fit mode of the thumbnail to get
 * @param {string} flip_v - The flip vertical of the thumbnail to get
 * @param {string} flip_h - The flip horizontal of the thumbnail to get
 * @param {string} format - The format of the thumbnail to get
 */
const thumbnail = async (ctx: Context) => {
  const { documentId } = ctx.params;
  const { token, time, width, height, rotate, fit_mode, flip_v, flip_h, format = 'jpg' } = ctx.query;

  let imageUrl = `https://image.mux.com/${documentId}/thumbnail.${format}`;

  const queryParams = new URLSearchParams();

  // Add token if provided
  if (token) {
    queryParams.append('token', token as string);
  }

  // Add optional parameters if provided
  if (time !== undefined) {
    queryParams.append('time', time as string);
  }

  if (width !== undefined) {
    queryParams.append('width', width as string);
  }

  if (height !== undefined) {
    queryParams.append('height', height as string);
  }

  if (rotate !== undefined) {
    queryParams.append('rotate', rotate as string);
  }

  if (fit_mode !== undefined) {
    queryParams.append('fit_mode', fit_mode as string);
  }

  if (flip_v !== undefined) {
    queryParams.append('flip_v', flip_v as string);
  }

  if (flip_h !== undefined) {
    queryParams.append('flip_h', flip_h as string);
  }

  // Append query parameters if any exist
  const queryString = queryParams.toString();
  if (queryString) {
    imageUrl += `?${queryString}`;
  }

  const response = await axios.get(imageUrl, {
    responseType: 'stream',
  });

  // Set the appropriate content type based on requested format
  const contentType = `image/${format}`;

  ctx.response.set('content-type', contentType);
  ctx.body = response.data;
};

/**
 * Get a storyboard from a video
 * @docs https://www.mux.com/docs/guides/player-advanced-usage#custom-storyboards
 * @param {string} documentId - The ID of the video to get the storyboard from
 * @param {string} token - The token to use to get the storyboard
 * @param {string} format - The format of the storyboard to get
 * @returns {Promise<void>}
 */
const storyboard = async (ctx: Context) => {
  const { documentId } = ctx.params;
  const { token, format = 'webp' } = ctx.query;

  // Determine the file extension based on the path parameter
  const extension = ctx.path.endsWith('.json') ? 'json' : 'vtt';

  // Build the base URL
  let imageUrl = `https://image.mux.com/${documentId}/storyboard.${extension}`;

  // Build query parameters
  const queryParams = new URLSearchParams();

  // Add format parameter (defaults to webp if not specified)
  queryParams.append('format', format as string);

  // Add token if provided
  if (token) {
    queryParams.append('token', token as string);
  }

  // Append all query parameters
  imageUrl += `?${queryParams.toString()}`;

  const response = await axios.get(imageUrl, {
    responseType: 'stream',
  });

  // Set the appropriate content type based on the requested extension
  const contentType = `application/${extension}`;
  ctx.response.set('content-type', contentType);
  ctx.body = response.data;
};

/**
 * Get an animated GIF or WebP from a video
 * @docs https://www.mux.com/docs/guides/get-images-from-a-video#get-an-animated-gif-from-a-video
 * @param {string} documentId - The ID of the video to get the animated GIF or WebP from
 * @param {string} token - The token to use to get the animated GIF or WebP
 * @param {string} start - The start time of the animated GIF or WebP
 * @param {string} end - The end time of the animated GIF or WebP
 * @param {string} width - The width of the animated GIF or WebP
 * @param {string} height - The height of the animated GIF or WebP
 */
const animated = async (ctx: Context) => {
  const { documentId } = ctx.params;
  const { token, start, end, width, height, fps, format = 'gif' } = ctx.query;

  // Build the base URL
  let imageUrl = `https://image.mux.com/${documentId}/animated.${format}`;

  // Build query parameters
  const queryParams = new URLSearchParams();

  // Add optional parameters if provided
  if (start !== undefined) {
    queryParams.append('start', start as string);
  }

  if (end !== undefined) {
    queryParams.append('end', end as string);
  }

  if (width !== undefined) {
    queryParams.append('width', width as string);
  }

  if (height !== undefined) {
    queryParams.append('height', height as string);
  }

  if (fps !== undefined) {
    queryParams.append('fps', fps as string);
  }

  // Add token if provided
  if (token) {
    queryParams.append('token', token as string);
  }

  // Append query parameters if any exist
  const queryString = queryParams.toString();
  if (queryString) {
    imageUrl += `?${queryString}`;
  }

  const response = await axios.get(imageUrl, {
    responseType: 'stream',
  });

  // Set the appropriate content type based on the requested format
  const contentType = `image/${format}`;
  ctx.response.set('content-type', contentType);
  ctx.body = response.data;
};

async function parseUploadRequest(ctx: Context) {
  const params = parseRequest(ctx, UploadDataWithoutFile, null, null);

  const config = UploadConfig.safeParse(params.body);

  if (!config.success) {
    throw new Error(config.error.message);
  }

  const { custom_text_tracks = [] } = config.data;

  const storedTextTracks = await storeTextTracks(custom_text_tracks);

  return {
    storedTextTracks,
    config: config.data,
    params,
  };
}

const postDirectUpload = async (ctx: Context) => {
  const { config, storedTextTracks, params } = await parseUploadRequest(ctx);

  const result = await getService('mux').getDirectUploadUrl({
    config,
    storedTextTracks,
    corsOrigin: ctx.request.header.origin,
  });

  const data = {
    title: params.body?.title || '',
    upload_id: result.id,
    ...config,
  };

  await strapi.documents(ASSET_MODEL).create({ data });

  ctx.send(result);
};

const postRemoteUpload = async (ctx: Context) => {
  const { config, storedTextTracks, params } = await parseUploadRequest(ctx);

  if (params.body?.upload_type !== 'url' || !params.body.url) {
    // ctx.badRequest's type seems to be off - we're following the official example: https://docs.strapi.io/dev-docs/error-handling#controllers-and-middlewares
    (ctx as any).badRequest('ValidationError', { errors: { url: ['url cannot be empty'] } });

    return;
  }

  const result = await getService('mux').createRemoteAsset({ config, storedTextTracks, url: params.body.url });

  const data = {
    asset_id: result.id,
    title: params.body?.title || '',
    url: params.body.url,
    ...config,
  };

  await strapi.documents(ASSET_MODEL).create({ data });

  ctx.send(result);
};

const deleteMuxAsset = async (ctx: Context) => {
  const { params, query } = parseRequest(
    ctx,
    null,
    z.object({ documentId: z.string().or(z.number()) }),
    z.object({ delete_on_mux: z.string().or(z.boolean()).default(true) })
  );

  // Ensure that the mux-asset entry exists for the id
  // @ts-ignore - v5 migration
  // const muxAsset = await strapi.documents(ASSET_MODEL).findOne(documentId);
  const muxAsset = await strapi.db.query(ASSET_MODEL).findOne({ where: { id: params.documentId } });

  if (!muxAsset) {
    ctx.notFound('mux-asset.notFound');

    return;
  }

  // Delete mux-asset entry
  // @ts-ignore - v5 migration
  // const deleteRes = await strapi.documents(ASSET_MODEL).delete(params.documentId);
  const deleteRes = await strapi.db.query(ASSET_MODEL).delete({ where: { id: params.documentId } });
  if (!deleteRes) {
    ctx.send({ success: false });
    return;
  }

  // @ts-ignore - v5 migration
  const { asset_id, upload_id } = deleteRes;
  const result = { success: true, deletedOnMux: false };

  // If the directive exists deleting the Asset from Mux
  if (query.delete_on_mux) {
    try {
      // Resolve the asset_id
      // - Use the asset_id that was available on the deleted mux-asset entry
      // - Else, resolve it from Mux using the upload_id
      const assetId = asset_id !== '' ? asset_id : (await getService('mux').getAssetByUploadId(upload_id)).id;

      const deletedOnMux = await getService('mux').deleteAsset(assetId);

      result.deletedOnMux = deletedOnMux;
    } catch (err) {}
  }

  ctx.send(result);
};

const muxWebhookHandler = async (ctx: Context) => {
  const body = ctx.request.body;
  const sigHttpHeader = ctx.request.headers['mux-signature'];

  const config = await Config.getConfig();

  if (
    sigHttpHeader === undefined ||
    sigHttpHeader === '' ||
    (Array.isArray(sigHttpHeader) && sigHttpHeader.length < 0)
  ) {
    ctx.throw(401, 'Webhook signature is missing');
  }

  if (Array.isArray(sigHttpHeader) && sigHttpHeader.length > 1) {
    ctx.throw(401, 'we have an unexpected amount of signatures');
  }

  let sig;

  if (Array.isArray(sigHttpHeader)) {
    sig = sigHttpHeader[0];
  } else {
    sig = sigHttpHeader;
  }

  // TODO: Currently commented out because we should be using the raw request body for verfiying
  // Webhook signatures, NOT JSON.stringify.  Strapi does not currently allow for access to the
  // Koa.js request (the middleware used for parsing requests).

  // let isSigValid;

  // try {
  //   isSigValid = Webhooks.verifyHeader(JSON.stringify(body), sig, config.webhook_signing_secret);
  // } catch(err) {
  //   ctx.throw(403, err);

  //   return;
  // }

  try {
    const outcome = await processWebhookEvent(body);

    if (outcome === undefined) {
      ctx.send('ignored');
    } else {
      const [id, params] = outcome;

      const result = await strapi.documents(ASSET_MODEL).update({
        documentId: id.toString(),
        data: params.data as any,
      });

      ctx.send(result);
    }
  } catch (error) {
    strapi.log.error('Webhook processing failed:', error);
    ctx.status = 500;
    ctx.send({ error: 'Webhook processing failed' });
  }
};

const signMuxPlaybackId = async (ctx: Context) => {
  const { documentId } = ctx.params;
  const { type } = ctx.query;

  const result = await getService('mux').signPlaybackId(documentId, type as string);

  ctx.send(result);
};

/**
 * Returns a text track stored in Strapi so Mux can download and parse it as an asset's subtitle/captions
 * For custom text tracks only.
 * @docs https://docs.mux.com/guides/add-subtitles-to-your-videos
 **/
const textTrack = async (ctx: Context) => {
  const { documentId } = ctx.params;

  // @ts-ignore - v5 migration
  // const track = (await strapi.documents(TEXT_TRACK_MODEL).findOne(documentId)) as StoredTextTrack | undefined;
  const track = (await strapi.db.query(TEXT_TRACK_MODEL).findOne(documentId)) as StoredTextTrack | undefined;

  if (!track) {
    ctx.notFound('mux-text-track.notFound');

    return;
  }

  const contentType = `${track.file.type}; charset=utf-8`;
  ctx.set({ 'Content-Type': contentType, 'Content-Disposition': `attachment; filename=${track.file.name}` });
  ctx.type = `${track.file.type}; charset=utf-8`;
  ctx.body = track.file.contents;
};

export default {
  postDirectUpload,
  postRemoteUpload,
  deleteMuxAsset,
  muxWebhookHandler,
  thumbnail,
  storyboard,
  signMuxPlaybackId,
  textTrack,
  animated,
};
