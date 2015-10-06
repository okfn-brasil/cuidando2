// import {showError} from './helpersT'
import msgs from '../store/msgs'


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
        method: params.method ? params.method : 'get',
    }
    if (params.data) {
        fParams.body = JSON.stringify(params.data)
        fParams.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    try {
        var response = await fetch(params.url, fParams)
    } catch(err) {
        msgs.addError('Error to access URL')
        console.log('ERRO ao tentar pegar:', params.url, err)
        return null
    }
    checkStatus(response)
    // console.log('request succeeded', params.url, response)

    // allows whole response return
    if (params.raw) {
        return response
    } else {
        return await response.json()
    }
}

export default ajax
