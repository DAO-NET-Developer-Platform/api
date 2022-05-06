const createError = require('http-errors')
const decision = require('../services/decision.service')

class DecisionController {

    static async createVoteDecision(req, res, next) {

        try {

            const data = await decision.createVoteDecision(req.body)

            return res.status(200).json({
                status: true,
                message: 'Decision created successfully',
                data
            })
            
        } catch (e) {
            return next(createError(e.statusCode, e.message))
        }

    }

    static async getVoteDecisions(req, res, next) {

        const { vote_id } = req.params

        try {

            const data = await decision.getVoteDecisions(vote_id, req.query.lang)

            return res.status(200).json({
                status: true,
                message: 'All Vote Decisions',
                data
            })
            
        } catch (e) {
            return next(createError(e.statusCode, e.message))
        }

    }

}

module.exports = DecisionController