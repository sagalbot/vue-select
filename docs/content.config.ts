import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    guide: defineCollection({
      type: 'page',
      source: 'guide/**/*.md',
      schema: z.object({
        section: z.string().optional(),
      }),
    }),

    api: defineCollection({
      type: 'page',
      source: 'api/**/*.md',
    }),
  },
})
