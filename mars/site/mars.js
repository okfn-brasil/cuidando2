console.log("RECARREGANDO-----------------")
// AUTH_URL = "http://teste.aqui:5000"
AUTH_URL = "http://localhost.aqui:5002"
COMMENTS_URL = "http://localhost.aqui:5005"

if(typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
} else {
    alert("No Web Storage support! Please use a newer browser...")
    // Sorry! No Web Storage support..
}


$("#login-button").click(function() {
    // $.ajax({
    //     url: AUTH_URL + '/login/facebook/',
    //     dataType: "json",
    //     // crossDomain: true,
    //     // xhrFields : {
    //     //     withCredentials : true
    //     // }
    // })
    $.getJSON(
        AUTH_URL + '/login/facebook/'
    )
    .done(function(response_data) {
        console.log("resp", response_data)
        origRedirect = response_data.redirect
        console.log(origRedirect)
        thisUrl = window.location.origin
        parts = origRedirect.split("%3F")
        newRedirect = parts[0].replace(/(redirect_uri=)[^\&]+/, '$1' + thisUrl) + "%3F" + parts[1]
        console.log(newRedirect)
        window.location.replace(newRedirect)
    })
})

if (window.location.search) {
    url = AUTH_URL + "/complete/facebook/" + window.location.search
    $.ajax({
        url        : url,
        dataType   : 'json',
        type       : 'POST',
    })
    .done(function(data) {
        // document.cookie = "token=" + data.token
        localStorage.token = data.token
        window.location.search = ""
    })
}


$("#send-button").click(function() {
    url = COMMENTS_URL + "/test/add"
    data = {
        'token': localStorage.token,
        'text': "Blha Blal Bhal Blah!"
    }
    console.log(data)
    $.ajax({
        url        : url,
        dataType   : 'json',
        contentType: 'application/json; charset=UTF-8',
        data       : JSON.stringify(data),
        type       : 'POST',
    })
})

$("#get-button").click(function() {
    url = COMMENTS_URL + "/test"
    $.getJSON(url)
    .done(function(data) {
        console.log(data)
    })
})

$("#register-button").click(function() {
    url = AUTH_URL + "/users/tester/register"
    data = {
        'password': "oooohhhhquesenhafera!!!"
    }
    $.ajax({
        url        : url,
        contentType: 'application/json; charset=UTF-8',
        data       : JSON.stringify(data),
        type       : 'POST',
    })
    .done(function(data) {
        console.log(data)
    })
})
