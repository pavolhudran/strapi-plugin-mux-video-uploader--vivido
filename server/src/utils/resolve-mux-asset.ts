import { MuxAsset } from '../content-types/mux-asset/types';
import { ASSET_MODEL, TEXT_TRACK_MODEL } from './types';

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
 * @param model - The model to query (defaults to ASSET_MODEL)
 * Handles operations using Strapi v5 API first, then database fallback
 * @param id - The ID (can be numeric string or document ID string)
 * @param action - The action to perform: 'findOne', 'delete', or 'update'
 * @param opts - Additional options for the operation
 * @returns The result of the operation
 */
export const asset = async (
  model: any = ASSET_MODEL,
  id: string | number,
  action: 'findOne' | 'delete' | 'update',
  opts = {}
): Promise<any> => {
  // Test if ID is numeric first to choose the right approach
  if (/^\d+$/.test(String(id))) {
    // Numeric ID - use database query directly
    return strapi.db.query(model)[action]({ where: { id: +id }, ...opts });
  }
  // Non-numeric ID - try v5 API first, then database fallback
  try {
    const docs = strapi.documents(model);
    return await {
      findOne: () => docs.findOne({ documentId: String(id), ...opts }),
      delete: () => docs.delete({ documentId: String(id) }),
      update: () => docs.update({ documentId: String(id), ...opts }),
    }[action]();
  } catch {
    return strapi.db.query(model)[action]({ where: { document_id: id }, ...opts });
  }
};
