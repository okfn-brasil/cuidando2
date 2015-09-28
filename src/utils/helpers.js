import router from '../store/router'

// Convert number to locale string
export function format(number, opts) {
    return number.toLocaleString(router.getParam('lang'), opts)
}

// Convert number to locale string with 2 decimal digits
export function formatCur(number) {
    return format(number, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

// Capitalize first letter
export function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1)
}


// Runs a function when an element outside of node is clicked
// Clears the callback if no node is passed
// Ignore event if is ignoreEvent (usefull to ignore a initial event originated
// outside of node).
export function onClickedOutside(node, func, ignoreEvent) {
    if (node) {
        // Save previous function
        // Maybe should be using a pile?
        if (document.onclick) document.prevOnclick = document.onclick

        document.onclick = (event) => {
            // Clicked outside of the node
            if (event != ignoreEvent && !event.ignoreEvent
                && !node.contains(event.target)) {
                func()
                document.onclick = document.prevOnclick
                document.prevOnclick = undefined
            }
        }
    } else {
        document.onclick = document.prevOnclick
        document.prevOnclick = undefined
    }
}


// Register signals to a store
export function registerSignals(self, signals) {
    for (let name of signals.split(' ')) {

        if (!self[name]) console.log('function not found for:',
                                     name, 'in', self)
        self.on(riot.VEC(name), params => {
            self[name](params)

        })
    }
}


// Format a string replacing '{name}' with params[name]
export function strFormat(str, params) {
    for (let name in params) {
        str = str.replace('{' + name + '}', params[name])
    }
    return str
}
