import { MuxAsset } from '../content-types/mux-asset/types';
export declare const resolveMuxAsset: (filters: MuxAssetFilter) => Promise<MuxAsset>;
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
export declare const asset: (model: any, id: string | number, action: 'findOne' | 'delete' | 'update', opts?: {}) => Promise<any>;
