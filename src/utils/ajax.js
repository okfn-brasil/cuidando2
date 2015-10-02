function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

async function ajax(params) {
    let fParams = {
        // If method is undefined, will default to 'get'
        method: params.method,
    }
    if (params.data) {
        fParams.body = JSON.stringify(params.data)
        fParams.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    let response = await fetch(params.url, fParams)
    checkStatus(response)
    let json = await response.json()
    console.log('request succeeded', params.url, response)
    return {json, meta: response}


    // .then(response => response.json()
    //         .then(json => {return {meta:response, json}}))
    // .then(function(data) {
    //     console.log('request succeeded with JSON response', data)
    //     return data
    // })
    // .catch(function(error) {
    //     console.log('request failed', error)
    // })
}

export default ajax
