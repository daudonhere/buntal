import type { RouteBuilderResult } from '../server/router'
import { buildFavicon, buildHotReloadScript, buildRoot } from './builder'

type BundlerConfig = {
  env?: 'development' | 'production'
  appDir?: string
  outDir?: string
  config?: Partial<Bun.BuildConfig>
}

export async function bundler(
  routes: RouteBuilderResult[],
  {
    env = (process.env.NODE_ENV as 'development' | 'production') ||
      'development',
    appDir = './app',
    outDir = '.buntal',
    config
  }: BundlerConfig = {}
) {
  await buildRoot(routes, appDir, outDir)
  await Bun.build({
    entrypoints: [outDir + '/root.tsx'],
    outdir: outDir + '/dist',
    target: 'browser',
    env: 'BUNTAL_PUBLIC_*',
    splitting: true,
    minify: {
      identifiers: true,
      syntax: true,
      whitespace: true
    },
    ...(config || {})
  })

  await buildFavicon(appDir, outDir)
  await buildHotReloadScript(env, outDir)
}
