// Test localStorage
// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
try {
    localStorage.setItem('t', 't')
    localStorage.removeItem('t')
} catch (e) {
    window.hasLocalStorage = false
    alert('Seu navegador parece não suportar localStorage. Por favor use um mais recente, ou você não conseguirá autenticar nesse site...')
}

// This code is needed to restore the hash after a redirect for login
// through a third-party.
// If redicected for login (from Facebook)
if (/^\?redirect_state=/.test(location.search)) {
    var url = location.origin + "/" + localStorage.prevhash
    // Save info to get tokens after page load/reload
    // If History is supported, tokens should be loaded after page load.
    // If History isn't supported, tokens should be loaded after page reload.
    localStorage.queryForToken = location.search
    if (window.history.replaceState) {
        window.history.replaceState(null, null, url)
    } else {
        // Fallback method that doesn't requires "window.history" but
        // reloads the page.
        location.href = url
    }
}
