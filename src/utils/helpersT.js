import t from '../utils/translator'

export function showError(msg) {
    console.log(t.translate(msg))
    // alert(t.translate(msg))
}
