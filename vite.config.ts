import * as reactPlugin from 'vite-plugin-react';
import type {UserConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

const config: UserConfig = {
  jsx: 'react',
  plugins: [
    reactPlugin,
    VitePWA({
      manifest: {
        short_name: 'Whisky Database',
        name: 'Whisky Database',
        lang: 'en',
        start_url: 'https://whisky-crawler.metz.link',
        background_color: '#1f2937',
        theme_color: '#1f2937',
        dir: 'ltr',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon/android-icon-192x192-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: '/icon/apple-icon-180x180-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '180x180',
          },
          {
            src: '/icon/apple-icon-152x152-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '152x152',
          },
          {
            src: '/icon/apple-icon-144x144-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '144x144',
          },
          {
            src: '/icon/apple-icon-120x120-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '120x120',
          },
          {
            src: '/icon/apple-icon-114x114-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '114x114',
          },
          {
            src: '/icon/favicon-96x96-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '96x96',
          },
          {
            src: '/icon/apple-icon-76x76-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '76x76',
          },
          {
            src: '/icon/apple-icon-72x72-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '72x72',
          },
          {
            src: '/icon/apple-icon-60x60-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '60x60',
          },
          {
            src: '/icon/apple-icon-57x57-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '57x57',
          },
          {
            src: '/icon/favicon-32x32-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/icon/favicon-16x16-dunplab-manifest-32824.png',
            type: 'image/png',
            sizes: '16x16',
          },
        ],
        prefer_related_applications: 'false',
      },
    }),
  ],
};

export default config;
