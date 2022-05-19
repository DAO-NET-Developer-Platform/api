const crypto = require('crypto')
const appendLeaf = require('../services/appendLeaf');

module.exports = async function(req, res, next) {

    // const data = crypto.Hmac('SHA256', 'What a testing').update('I love cupcakes').digest('hex');


    await appendLeaf('Testing_Dao', 'Trying', '18903181363824143898991577644926413440129187799018296116511855593047705859145')

    res.status(200).json({
        status: true,
        message: 'Appended successfully'
    })
}