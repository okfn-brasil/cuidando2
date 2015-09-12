const _domain = 'http://cuidando.aqui:'
const _domain_prod = 'http://cuidando.org.br:'

// API_URL = _domain % '5000'
// AUTH_API_URL = _domain % '5002'
// COMMENTS_API_URL = _domain % '5003'
// ESIC_API_URL = _domain % '5004'

const config = {
    apiurl_money: _domain + 5000,
    apiurl_auth: _domain + 5002,
    // apiurl_comments: _domain + 5003,
    apiurl_comments: _domain_prod + 5003,
}

export default config
