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

function parseJSON(response) {
    return response.json()
}

function ajax(params) {
    // return xr({
    //     method: method.toUpperCase(),
    //     dataType   : 'json',
    //     contentType: 'application/json; charset=UTF-8',
    //     url: url,
    //     // params: {take: 5},
    //     events: {
    //         [xr.Events.PROGRESS]: (xhr, xhrProgressEvent) => {
    //             console.log("xhr", xhr);

    //             console.log("progress", xhrProgressEvent);
    //         }
    //     }
    // })
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
    .then(parseJSON)
    .then(function(data) {
        console.log('request succeeded with JSON response', data)
        return data
    }).catch(function(error) {
        console.log('request failed', error)
    })
}

export default ajax
