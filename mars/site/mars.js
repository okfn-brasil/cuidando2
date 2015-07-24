console.log("RECARREGANDO-----------------")
// AUTH_URL = "http://teste.aqui:5000"
AUTH_URL = "http://localhost.aqui:5000"

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
    console.log("SEARCH", url)
    // window.location.search = ""
    $.getJSON(url)
    .done(function(data) {
        console.log( "done" );
        console.log(data);
    })
}
