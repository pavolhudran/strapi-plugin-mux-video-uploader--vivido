import { MuxAsset } from '../content-types/mux-asset/types';
import { ASSET_MODEL } from './types';

export const resolveMuxAsset = async (filters: MuxAssetFilter): Promise<MuxAsset> => {
  const muxAssets = await strapi.documents(ASSET_MODEL).findMany({
    filters: filters as any,
  });

  const asset = muxAssets ? (Array.isArray(muxAssets) ? muxAssets[0] : muxAssets) : undefined;

  if (!asset) {
    const filterDetails = Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');
    throw new Error(`Unable to resolve mux-asset with filters: ${filterDetails}`);
  }

  return asset as unknown as MuxAsset;
};

export interface MuxAssetFilter {
  upload_id?: string;
  asset_id?: string;
  documentId?: string;
  id?: string;
}
