import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-10-21',
    token: import.meta.env.VITE_SANITY_TOKEN, // or leave blank for unauthenticated usage
    useCdn: true
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)