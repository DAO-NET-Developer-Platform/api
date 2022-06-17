const routes = require('express').Router()
const decision = require('../controllers/decision.controller')
const check = require('../middlewares/decisionCheck')
const globalCheck = require('../middlewares/check')
const validator = require('../middlewares/validator')
const schemas = require('../validators/decision.validator')

routes.get('/vote/:vote_id', [check.isUser, check.getLangVote], decision.getVoteDecisions)
routes.post('/vote/:vote_id', [check.isUser, check.isMember, check.getLangOption, check.getLangVote, check.hasDecided], decision.createVoteDecision)
routes.get('/vote/:vote_id/all', globalCheck.getLang, decision.getAllVoters)

routes.get('/budget/:vote_id', [check.isUser, check.getLangVote])
routes.post('/budget/:vote_id', [check.isUser, check.isMember, check.getLangVote, check.isPending], decision.createBudgetDecision)
// routes.post('/budget/:budget_id', decision.create)



module.exports = routes