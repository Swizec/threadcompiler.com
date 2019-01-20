/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/app/)) {
    page.matchPath = '/app/*'
    createPage(page)
  }
}

exports.modifyWebpackConfig = ({ config, stage }) => {
  switch (stage) {
    case 'build-html':
      config.plugin('define', webpack.DefinePlugin, [
        {
          'global.GENTLY': false,
        },
      ])
      break
  }
  return config
}
