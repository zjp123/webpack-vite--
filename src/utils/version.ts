export const version =
  (import.meta.env.REACT_APP_TEST === 'cdn' || import.meta.env.REACT_APP_GZIP === 'gzip')
    ? // 线上环境 和 打包环境
      'V2.9.1'
    : // 测网环境
    import.meta.env.REACT_APP_TEST === 'test'
    ? '测网环境'
    : // 开发环境
    import.meta.env.NODE_ENV === 'development'
    ? '开发环境'
    : '???'
