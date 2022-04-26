const Language = require('../models/Language')
const language_data = require('../data/languages.json')

class LanguageService {

    static async all() {

        return await Language.find({}).lean()

    }

    static async migrate() {

        console.log(language_data)

        await Promise.all(language_data.map(el => Language.create(el)))

        return

    }

}

module.exports = LanguageService