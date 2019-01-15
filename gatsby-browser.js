/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

const Auth = require('./src/Auth/Auth').default

console.log(Auth)

exports.onClientEntry = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const auth = new Auth()
        auth.renewSession();
    }
}