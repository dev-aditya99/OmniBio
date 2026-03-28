import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmniBio',
    short_name: 'OmniBio',
    description: 'One link for everything you do. Connect your audience to all of your content with just one link.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: 'https://ik.imagekit.io/adityazvs6yuayk/logos/favicon-32x32.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: 'https://ik.imagekit.io/adityazvs6yuayk/logos/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: 'https://ik.imagekit.io/adityazvs6yuayk/logos/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://ik.imagekit.io/adityazvs6yuayk/logos/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  }
}