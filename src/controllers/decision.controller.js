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

        const { vote_id, user_id } = req.params

        try {

            const data = await decision.getVoteDecisions(vote_id, req.query.lang, user_id)

            return res.status(200).json({
                status: true,
                message: 'All Vote Decisions',
                data
            })
            
        } catch (e) {
            return next(createError(e.statusCode, e.message))
        }

    }

    static async getAllVoters(req, res, next) {

        const { vote_id } = req.params
         
        const voteData = {}
        voteData.lang = req.language
        voteData.address = req.query.address

        try {

            const data = await decision.getAllVoters(vote_id, voteData)

            return res.status(200).json({
                status: true,
                message: 'All Vote Decisions',
                data
            })
            
        } catch (e) {
            return next(createError(e.statusCode, e.message))
        }

    }

    static async createBudgetDecision(req, res, next) {

        try {

            try {

                const data = await decision.createBudgetDecision(req.body)
    
                return res.status(200).json({
                    status: true,
                    message: 'Decision created successfully',
                    data
                })
                
            } catch (e) {
                return next(createError(e.statusCode, e.message))
            }

        } catch (e) {

        }

    }

}

module.exports = DecisionController