import router from '../store/router'

// Convert number to locale string
export function format(number) {
    return number.toLocaleString(router.getParam('lang'))
}

// Capitalize first letter
export function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1)
}
