import Mux from '@mux/mux-node';

import { ParsedUploadConfig, StoredTextTrack, uploadConfigToNewAssetInput } from '../../../types/shared-types';
import pluginPkg from '../../../package.json';
import { Config } from '../utils';

export interface UploadRequestConfig {
  /**
   * Enable static renditions by setting this to 'standard'. Can be overwritten on a per-asset basis.
   * @see {@link https://docs.mux.com/guides/video/enable-static-mp4-renditions#why-enable-mp4-support}
   * @defaultValue 'none'
   */
  mp4_support?: 'none' | 'standard';

  /**
   * Max resolution tier can be used to control the maximum resolution_tier your asset is encoded, stored, and streamed at.
   * @see {@link https://docs.mux.com/guides/stream-videos-in-4k}
   * @defaultValue '1080p'
   */
  max_resolution_tier?: '2160p' | '1440p' | '1080p';

  signed?: 'true' | 'false';
}

const getMuxClient = async () => {
  const { accessTokenId, secretKey } = await Config.getConfig();

  return new Mux({
    tokenId: accessTokenId,
    tokenSecret: secretKey,
    defaultHeaders: {
      'x-source-platform': `Strapi CMS | ${pluginPkg.version}`,
    },
  });
};

const muxService = () => ({
  async getAssetById(assetId: string) {
    const { video } = await getMuxClient();

    return await video.assets.retrieve(assetId);
  },

  async getAssetByUploadId(uploadId: string) {
    const { video } = await getMuxClient();

    const assets = await video.assets.list({ upload_id: uploadId });

    return assets.data[0];
  },

  async getDirectUploadUrl({
    config,
    storedTextTracks = [],
    corsOrigin = '*',
  }: {
    config: ParsedUploadConfig;
    storedTextTracks: StoredTextTrack[];
    corsOrigin?: string;
  }): Promise<Mux.Video.Uploads.Upload> {
    const { video } = await getMuxClient();

    // video_quality is passed natively now (upstream #99); the encoding_tier workaround is gone.
    // AssetOptions is the type of new_asset_settings; inputs replaces the deprecated input param.
    const newAssetSettings: Mux.Video.Assets.AssetOptions = {
      inputs: uploadConfigToNewAssetInput(config, storedTextTracks) || [],
      playback_policy: [config.signed ? 'signed' : 'public'],
      video_quality: config.video_quality,
      max_resolution_tier: config.max_resolution_tier,
    };

    // Handle static renditions vs mp4_support (no conflicts)
    const staticRenditions = (config as any).static_renditions;
    if (staticRenditions && Array.isArray(staticRenditions) && staticRenditions.length > 0) {
      (newAssetSettings as any).static_renditions = staticRenditions;
    } else {
      // Always include mp4_support for API compatibility
      newAssetSettings.mp4_support = config.mp4_support;
    }

    return video.uploads.create({
      cors_origin: corsOrigin,
      new_asset_settings: newAssetSettings,
    });
  },

  async createRemoteAsset({
    url,
    config,
    storedTextTracks,
  }: {
    url: string;
    storedTextTracks: StoredTextTrack[];
    config: ParsedUploadConfig;
  }) {
    const { video } = await getMuxClient();

    // inputs replaces the deprecated input param on asset creation (upstream #99)
    const assetParams: Mux.Video.Assets.AssetCreateParams = {
      inputs: uploadConfigToNewAssetInput(config, storedTextTracks, url) || [],
      playback_policy: [config.signed ? 'signed' : 'public'],
      video_quality: config.video_quality,
      max_resolution_tier: config.max_resolution_tier,
    };

    // Handle static renditions vs mp4_support (no conflicts)
    const staticRenditions = (config as any).static_renditions;
    if (staticRenditions && Array.isArray(staticRenditions) && staticRenditions.length > 0) {
      (assetParams as any).static_renditions = staticRenditions;
    } else {
      // Always include mp4_support for API compatibility
      assetParams.mp4_support = config.mp4_support;
    }

    return video.assets.create(assetParams);
  },

  async deleteAsset(assetId: string) {
    const { video } = await getMuxClient();

    await video.assets.delete(assetId);

    return true;
  },

  async signPlaybackId(playbackId: string, type: string) {
    const { jwt } = await getMuxClient();
    const { playbackSigningSecret, playbackSigningId } = await Config.getConfig();

    let baseOptions = {
      keyId: playbackSigningId,
      keySecret: playbackSigningSecret,
      // Uniform 1d: thumbnail/storyboard tokens are baked into server-rendered pages,
      // so a short expiry goes stale mid-session (vivido2-api#145)
      expiration: '1d',
    };

    let params = { width: type === 'thumbnail' ? '512' : '' };

    const token = await jwt.signPlaybackId(playbackId, {
      ...baseOptions,
      // @ts-expect-error This `type` type isn't properly exposed by the Mux SDK
      type,
      params,
    });

    return { token };
  },

  async createAssetTextTracks(assetId: string, tracks: Mux.Video.Assets.AssetCreateTrackParams[]) {
    const { video } = await getMuxClient();

    return await Promise.all(tracks.map((track) => video.assets.createTrack(assetId, track)));
  },

  async deleteAssetTextTracks(assetId: string, trackIds: string[]) {
    const { video } = await getMuxClient();

    return await Promise.all(trackIds.map((id) => video.assets.deleteTrack(assetId, id)));
  },
});

export default muxService;

export type MuxService = ReturnType<typeof muxService>;
