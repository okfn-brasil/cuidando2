class Translator {
    constructor() {
        this.pt = {"Login": "Entrar"}
        this.en = {"Login": "LOGIN!!!!"}
        this.dict = this.pt
    }

    translate(text) {
        return text
    }

    toggleLang() {
        if (this.dict == this.pt) this.dict = this.en
        else this.dict = this.pt
    }
}

let translator = new Translator()

export default translator
