const Language = require('../models/Language')
const language_data = require('../data/languages.json')
const translate = require('translate-google')

class LanguageService {

    static async all() {

        return await Language.find({}).lean()

    }

    static async migrate() {

        console.log(language_data)

        await Promise.all(language_data.map(el => Language.create(el)))

        return

    }

    static async translate(data, lang) {

        return translate(data, { to: lang })

    }

}

module.exports = LanguageService