import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmniBio',
    short_name: 'OmniBio',
    description: 'One link for everything you do. Connect your audience to all of your content with just one link.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
  }
}
