import { MuxAsset } from '../content-types/mux-asset/types';
import { ASSET_MODEL } from './types';

export const resolveMuxAsset = async (filters: MuxAssetFilter): Promise<MuxAsset> => {
  // const muxAssets = await strapi.documents(ASSET_MODEL).findMany({
  //   filters: filters as any
  // });

  const muxAssets = await strapi.db.query(ASSET_MODEL).findMany({
    filters,
  });

  const asset = muxAssets ? (Array.isArray(muxAssets) ? muxAssets[0] : muxAssets) : undefined;

  if (!asset) throw new Error('Unable to resolve mux-asset');

  return asset;
};

export interface MuxAssetFilter {
  upload_id?: string;
  asset_id?: string;
  documentId?: string;
  id?: string;
}

/**
 * Handles Mux asset operations using Strapi v5 API first, then database fallback
 * @param id - The ID of the Mux asset (can be numeric string or document ID string)
 * @param action - The action to perform on the Mux asset: 'findOne', 'delete', or 'update'
 * @param opts - Additional options for the operation
 * @returns The result of the operation
 */
export const asset = async (id: string | number, action: 'findOne' | 'delete' | 'update', opts = {}): Promise<any> => {
  // Test if ID is numeric first to choose the right approach
  if (/^\d+$/.test(String(id))) {
    // Numeric ID - use database query directly
    return strapi.db.query(ASSET_MODEL)[action]({ where: { id: +id }, ...opts });
  }
  // Non-numeric ID - try v5 API first, then database fallback
  try {
    return await strapi
      .documents(ASSET_MODEL)
      [action as string](action === 'delete' ? { documentId: String(id) } : { documentId: String(id), ...opts });
  } catch {
    return strapi.db.query(ASSET_MODEL)[action]({ where: { documentId: id }, ...opts });
  }
};
