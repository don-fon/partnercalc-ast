export const PUBLIC_PATH = process.env.REPO_NAME
    ? `/${process.env.REPO_NAME}/`
    : '/'

export const ROUTER_BASENAME = PUBLIC_PATH === '/'
    ? '/'
    : PUBLIC_PATH.replace(/\/$/, '')

export const withPublicPath = (path: string) => (
    `${PUBLIC_PATH}${path.replace(/^\//, '')}`
)
