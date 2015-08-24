define(["jquery"], function($) {

    'use strict';

    // The page was reloaded and a getToken is pending. Needed when browser has
    // no support for window.history
    if (localStorage.queryForToken) {
        // TODO: ver pq esse getTokens, depois do reload quando não tem window.history, não funciona
        getTokens(localStorage.queryForToken)
        localStorage.queryForToken = ""
    }

    // If redicected for login (from Facebook)
    if (/^\?redirect_state=/.test(location.search)) {
        var url = location.origin + "/" + localStorage.prevhash
        // var query = location.search.replace("redirected_for_login=1&", "")
        if (window.history.replaceState) {
            getTokens(location.search)
            window.history.replaceState(null, null, url)
        } else {
            // Save info to get tokens after page reload
            localStorage.queryForToken = location.search
            // Fallback method that doesn't requires "window.history" but
            // reloads the page.
            location.href = url
        }
    }
})
