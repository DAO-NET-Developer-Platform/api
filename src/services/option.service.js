const Option = require('../models/Option')
const language = require('../services/language.service')
const optionsData = require('../data/options.json')
const LanguageOption = require('../models/LanguageOption')

class OptionService {

    static async create() {

        const options = await Option.insertMany(optionsData)

        const languages = await language.all()

        await Promise.all(options.map(async (opt, i) => {
            await Promise.all(languages.map(async (lang, i) => {

                const title = await language.translate(opt.title, lang.code)

                const lang_data = {
                    title,
                    language: lang._id,
                    option: opt._id
                }

                await LanguageOption.create(lang_data)

            }))
        }))

        return options

    }

    static async all(options, lang) {

        if(!lang) return options

        const data = await LanguageOption.find({ $or: [ { option: options[0]._id }, { option: options[1]._id } ] })

        return data

    }

}

module.exports = OptionService