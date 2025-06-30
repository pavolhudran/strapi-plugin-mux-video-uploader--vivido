const routes = [
  {
    method: 'GET',
    path: '/mux-asset',
    handler: 'mux-asset.find',
    config: {
      description: 'Returns all the MuxAsset items',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/count',
    handler: 'mux-asset.count',
    config: {
      description: 'Returns a count of MuxAsset items',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/:documentId',
    handler: 'mux-asset.findOne',
    config: {
      description: 'Returns a MuxAsset based on a supplied document id',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/upload/:uploadId',
    handler: 'mux-asset.getByUploadId',
    config: {
      description: 'Get mux assets by asset ID',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/asset/:assetId',
    handler: 'mux-asset.getByAssetId',
    config: {
      description: 'Get mux assets by asset ID',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/playback/:playbackId',
    handler: 'mux-asset.getByPlaybackId',
    config: {
      description: 'Get mux asset by playback ID',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-settings',
    handler: 'mux-settings.isConfigured',
    config: {
      description: 'Checks if the Mux settings are configured',
      policies: [],
    },
  },
];

export default routes;
