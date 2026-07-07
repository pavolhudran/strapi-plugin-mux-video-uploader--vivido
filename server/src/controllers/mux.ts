import axios from 'axios';
import { Context } from 'koa';
import { z } from 'zod';

import { StoredTextTrack, UploadConfig, UploadDataWithoutFile } from '../../../types/shared-types';
import { Config, getService } from '../utils';
import { parseRequest } from '../utils/parse-json-body';
import { resolveMuxAsset, queryAsset } from '../utils/resolve-mux-asset';
import { storeTextTracks, getMuxTextTrackUrl } from '../utils/text-tracks';
import { ASSET_MODEL, TEXT_TRACK_MODEL } from '../utils/types';

const processWebhookEvent = async (webhookEvent: any) => {
  const { type, data } = webhookEvent;

  switch (type) {
    // Handle video.upload.asset_created webhook
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
    // Handle video.asset.ready webhook
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
    // Handle video.asset.track.ready webhook
    case 'video.asset.track.ready': {
      try {
        const muxAsset = await resolveMuxAsset({ asset_id: data.asset_id });
        // Fetch the complete asset data from Mux API to get updated tracks
        const completeAssetData = await getService('mux').getAssetById(data.asset_id);

        // Create text track records for generated tracks (auto-captions)
        if (completeAssetData.tracks) {
          const newTextTracks = completeAssetData.tracks.filter(
            (track: any) =>
              track.type === 'text' &&
              track.text_type === 'subtitles' &&
              track.status === 'ready' &&
              track.text_source === 'generated_vod'
          );

          if (newTextTracks.length > 0) {
            try {
              // Get signed token if asset is signed
              const signedToken = muxAsset.signed
                ? (await getService('mux').signPlaybackId(muxAsset.playback_id, 'video')).token
                : undefined;

              // Fetch track content from Mux and convert to ParsedCustomTextTrack format
              const tracksToStore = await Promise.all(
                newTextTracks.map(async (track: any) => {
                  try {
                    // Get track content from Mux
                    const trackUrl = getMuxTextTrackUrl({
                      playback_id: muxAsset.playback_id,
                      track: { id: track.id },
                      signedToken,
                    });

                    const response = await fetch(trackUrl);
                    if (!response.ok) {
                      throw new Error(`Failed to fetch track: ${response.statusText}`);
                    }

                    const contents = await response.text();
                    const contentLength = response.headers.get('content-length');

                    return {
                      name: track.name,
                      language_code: track.language_code,
                      closed_captions: track.closed_captions || false,
                      track_id: track.id,
                      asset_id: data.asset_id,
                      file: {
                        contents,
                        type: 'text/vtt',
                        name: `${track.name}.vtt`,
                        size: contentLength ? parseInt(contentLength) : contents.length,
                      },
                    };
                  } catch (fetchError) {
                    console.log(`INFO: Failed to fetch content for track ${track.id}:`, fetchError);
                    // Return null to skip this track
                    return null;
                  }
                })
              );

              // Filter out failed tracks and use existing storeTextTracks function
              const validTracks = tracksToStore.filter((track) => track !== null);
              if (validTracks.length > 0) {
                await storeTextTracks(validTracks);
              }
            } catch (trackError) {
              console.log(`INFO: Failed to store text tracks:`, trackError);
            }
          }
        }

        return [
          muxAsset.id,
          {
            data: {
              asset_data: completeAssetData,
            },
          },
        ] as const;
      } catch (error) {
        console.log(`INFO: Skipping video.asset.track.ready webhook - no matching asset_id: ${data.asset_id}`);
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
  const muxAsset = await queryAsset(ASSET_MODEL, params.documentId, 'findOne');

  if (!muxAsset) {
    ctx.notFound('mux-asset.notFound');
    return;
  }

  // Get asset_id and upload_id before deletion
  const { asset_id, upload_id } = muxAsset;

  // Delete mux-asset entry
  const deleteRes = await queryAsset(ASSET_MODEL, params.documentId, 'delete');
  if (!deleteRes) {
    ctx.send({ success: false });
    return;
  }
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

      const result = await queryAsset(ASSET_MODEL, id, 'update', { data: params.data });

      ctx.send(result);
    }
  } catch (error) {
    strapi.log.error('Webhook processing failed:', error);
    ctx.status = 500;
    ctx.send({ error: 'Webhook processing failed' });
  }
};

const SIGNABLE_TYPES = ['video', 'thumbnail', 'storyboard', 'animated'];
// Storyboard is a frame grid of the whole video, so it is gated like video;
// thumbnail/animated stay public (cards and hover previews shown to non-buyers).
const GATED_TYPES = ['video', 'storyboard'];

// Resolves the lesson/course owning an asset, preferring the given publication status.
// Queried from the content side (documents API) so draft vs published is explicit.
const resolveOwningContent = async (assetDocumentId: string, relations: string[], status: 'published' | 'draft') => {
  for (const entityType of relations) {
    const entity = await (strapi.documents as any)(`api::${entityType}.${entityType}`).findFirst({
      status,
      filters: { mux_asset: { documentId: { $eq: assetDocumentId } } },
      fields: ['documentId', 'pricing', 'deleted_at'],
      populate: { profile: { fields: ['documentId'], populate: { user: { fields: ['id'] } } } },
    });
    if (entity) return { entityType, entity };
  }
  return undefined;
};

// Tokens are only minted for stored assets; video/storyboard for paid, unpublished or
// soft-deleted lesson/course content additionally require an admin, the owner, or (for
// live paid content) an entitled buyer — stock signed any playback ID unauthenticated
// (vivido2-api#50, #145).
const signMuxPlaybackId = async (ctx: Context) => {
  const { documentId: playbackId } = ctx.params;
  const { type } = ctx.query;

  if (typeof type !== 'string' || !SIGNABLE_TYPES.includes(type)) {
    ctx.badRequest('Invalid or missing type');
    return;
  }

  // The route param is a Mux playback ID, not a Strapi documentId.
  const asset = await strapi.db.query(ASSET_MODEL).findOne({ where: { playback_id: playbackId } });

  if (!asset) {
    ctx.notFound('mux-asset.notFound');
    return;
  }

  // Content relations exist only when the host app extends the mux-asset schema;
  // playlist/profile-owned and unrelated assets have no entitlement model and stay public.
  const attributes = strapi.contentType(ASSET_MODEL as any)?.attributes ?? {};
  const contentRelations = ['lesson', 'course'].filter((relation) => relation in attributes);

  if (GATED_TYPES.includes(type) && contentRelations.length > 0) {
    const published = await resolveOwningContent(asset.documentId, contentRelations, 'published');
    const owning = published ?? (await resolveOwningContent(asset.documentId, contentRelations, 'draft'));

    if (owning) {
      const { entity, entityType } = owning;
      // Only live (published, not soft-deleted) content can be free or bought;
      // drafts and deleted content are owner/admin-only regardless of pricing.
      const isLive = Boolean(published) && !entity.deleted_at;
      const isFree = isLive && Array.isArray(entity.pricing) && entity.pricing.includes('free');

      if (!isFree) {
        // Strapi admin-panel operators (admin auth strategy) bypass entitlement.
        const isAdminPanel = ctx.state.auth?.strategy?.name === 'admin';

        if (!isAdminPanel) {
          const user = ctx.state.user;

          if (!user) {
            ctx.unauthorized();
            return;
          }

          const isAdmin = user.role?.type === 'admin';
          const isOwner = entity.profile?.user?.id === user.id;

          if (!isAdmin && !isOwner) {
            let entitled = false;

            if (isLive) {
              const entitlementService = (strapi as any).services?.['api::entitlement.entitlement'];

              // Fail closed: paid content in a host app without the entitlement service stays unsigned
              if (typeof entitlementService?.checkPaidSingle !== 'function') {
                strapi.log.warn(
                  'signMuxPlaybackId: api::entitlement.entitlement.checkPaidSingle unavailable — refusing to sign paid content'
                );
              } else {
                entitled = await entitlementService.checkPaidSingle(user, entity.documentId, entityType);
              }
            }

            if (!entitled) {
              ctx.forbidden();
              return;
            }
          }
        }
      }
    }
  }

  const result = await getService('mux').signPlaybackId(playbackId, type);

  ctx.send(result);
};

// Marker for host apps: lets the vivido2-api strapi-server.ts extension detect this
// patched plugin version and fail closed when an ungated version is installed instead.
(signMuxPlaybackId as any).entitlementGated = true;

/**
 * Returns a text track stored in Strapi so Mux can download and parse it as an asset's subtitle/captions
 * For custom text tracks only.
 * @docs https://docs.mux.com/guides/add-subtitles-to-your-videos
 **/
const textTrack = async (ctx: Context) => {
  const { documentId } = ctx.params;

  const track = (await queryAsset(TEXT_TRACK_MODEL, documentId, 'findOne')) as StoredTextTrack | undefined;

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
