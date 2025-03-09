import nextMDX from '@next/mdx'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  redirects: async () => [
    {
      source: '/events',
      destination: '/events.ics',
      permanent: true,
    },
    {
      source: '/api/ical',
      destination: '/events.ics',
      permanent: true,
    },
  ],
}

export default withSearch(withMDX(nextConfig))
