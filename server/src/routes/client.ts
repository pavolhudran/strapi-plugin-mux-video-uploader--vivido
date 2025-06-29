const routes = [
  {
    method: 'POST',
    path: '/direct-upload',
    handler: 'mux.postDirectUpload',
    config: {
      description: 'Proxies direct upload requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/remote-upload',
    handler: 'mux.postRemoteUpload',
    config: {
      description: 'Proxies remote upload requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/mux-asset/:documentId',
    handler: 'mux.deleteMuxAsset',
    config: {
      description: 'Deletes a MuxAsset based on a supplied document id',
      policies: [],
    },
  },

  {
    method: 'GET',
    path: '/thumbnail/:documentId',
    handler: 'mux.thumbnail',
    config: {
      description: 'Proxies thumbnail requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/storyboard/:documentId',
    handler: 'mux.storyboard',
    config: {
      description: 'Proxies storyboard requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/animated/:documentId',
    handler: 'mux.animated',
    config: {
      description: 'Proxies animated requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/sign/:documentId',
    handler: 'mux.signMuxPlaybackId',
    config: {
      description: 'Proxies sign playback ID requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-text-tracks/:documentId',
    handler: 'mux.textTrack',
    config: {
      description: 'Proxies text track requests to load correctly within the Strapi Admin Dashboard',
      policies: [],
    },
  },
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
    method: 'POST',
    path: '/mux-asset',
    handler: 'mux-asset.create',
    config: {
      description: 'Creates a MuxAsset',
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/mux-asset/:documentId',
    handler: 'mux-asset.update',
    config: {
      description: 'Updates a MuxAsset based on a supplied document id',
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/mux-asset/:documentId',
    handler: 'mux-asset.del',
    config: {
      description: 'Deletes a MuxAsset based on a supplied document id',
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
