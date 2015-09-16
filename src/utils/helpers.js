import router from '../store/router'

// Convert number to locale string
export function format(number, opts) {
    return number.toLocaleString(router.getParam('lang'), opts)
}

// Convert number to locale string with 2 decimal digits
export function formatCur(number) {
    return format(number, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2}
    )
}

// Capitalize first letter
export function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1)
}
