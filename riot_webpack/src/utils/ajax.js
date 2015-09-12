// import xr from 'xr'
// import fetch from 'whatwg-fetch'

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

// function parseJSON(response) {

//     return {json: response.json().then(json =>)}
// }

function ajax(params) {
    let fParams = {
        method: params.method,
    }
    if (params.data) {
        fParams.body = JSON.stringify(params.data)
        fParams.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    return fetch(params.url, fParams)
    .then(checkStatus)
    .then(response => response.json().then(json => {return {response, json}}))
    // .then(parseJSON)
    .then(function(data) {
        console.log('request succeeded with JSON response', data)
        return data
    })
    // .catch(function(error) {
    //     console.log('request failed', error)
    // })
}

export default ajax
