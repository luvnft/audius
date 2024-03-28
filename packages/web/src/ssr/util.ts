import { resolveRoute } from 'vike/routing'
import type { PageContextServer } from 'vike/types'

import {
  staticRoutes,
  PROFILE_PAGE_ALBUMS,
  PROFILE_PAGE_COLLECTIBLES,
  PROFILE_PAGE_COLLECTIBLE_DETAILS,
  PROFILE_PAGE_PLAYLISTS,
  PROFILE_PAGE_REPOSTS,
  PROFILE_PAGE_TRACKS,
  CHANGE_EMAIL_SETTINGS_PAGE,
  CHANGE_PASSWORD_SETTINGS_PAGE
} from 'utils/route'

const assetPaths = new Set(['src', 'assets', 'scripts', 'fonts', 'favicons'])

const invalidPaths = new Set(['undefined'])

const nonSsrPaths = [
  PROFILE_PAGE_TRACKS,
  PROFILE_PAGE_ALBUMS,
  PROFILE_PAGE_PLAYLISTS,
  PROFILE_PAGE_REPOSTS,
  PROFILE_PAGE_COLLECTIBLES,
  PROFILE_PAGE_COLLECTIBLE_DETAILS,
  CHANGE_EMAIL_SETTINGS_PAGE,
  CHANGE_PASSWORD_SETTINGS_PAGE
]

export const makePageRoute =
  (routes: string[], pageName?: string) =>
  ({ urlPathname }: PageContextServer) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]

      // Don't render page if the route matches any of the asset, invalid, or static  routes
      if (
        assetPaths.has(urlPathname.split('/')[1]) ||
        invalidPaths.has(urlPathname.split('/')[1]) ||
        staticRoutes.has(urlPathname)
      ) {
        continue
      }

      if (
        urlPathname.split('/')[route.split('/').length - 1] === 'index.css.map'
      ) {
        continue
      }

      const result = resolveRoute(route, urlPathname)
      const nonSsrPathResult = nonSsrPaths.some(
        (path) => resolveRoute(path, urlPathname).match
      )

      if (result.match && !nonSsrPathResult) {
        console.info(`Rendering ${pageName ?? route}`, urlPathname)
        return result
      }
    }
    return false
  }
