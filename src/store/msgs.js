import {registerSignals} from '../utils/helpers'

class MsgList {

    constructor(signal) {
        this.init(signal)
    }

    init(signal) {
        riot.observable(this)

        this._msgs = []

        this.signal = signal

        // this.on(riot.VEL(this.signal), (key, force) => {
        //     // console.log('mapstore:signal', this.signal, 'key:', key)
        //     if (this.forceKey) key = this.forceKey
        //     if (key) this.load(key, force)
        // })
        registerSignals(this, 'rmMsg')
        riot.control.addStore(this)
    }

    triggerChanged() {
        this.trigger(riot.SEC(this.signal), this._msgs)
    }

    // Add a message
    addMsg(text, type) {
        let msg = {text, type}
        this._msgs.push(msg)
        this.triggerChanged()
        setTimeout(() => this.rmMsg(msg), 5000)
    }

    // Add error message
    addError(text) {
        this.addMsg(text, 'error')
    }

    // Add success message
    addSuccess(text) {
        this.addMsg(text, 'success')
    }

    // rmMsg(msgIndex) {
    //     this._msgs.splice(msgIndex, 1)
    //     this.triggerChanged()
    // }

    // Remove a message
    rmMsg(msg) {
        let index = this._msgs.indexOf(msg)
        if (index != -1) {
            this._msgs.splice(index, 1)
            this.triggerChanged()
        }
    }
}

let msgList = new MsgList('msgList')
export default msgList
