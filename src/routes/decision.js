const routes = require('express').Router()
const decision = require('../controllers/decision.controller')
const check = require('../middlewares/decisionCheck')
const globalCheck = require('../middlewares/check')

routes.get('/vote/:vote_id', [check.isUser, check.getLangVote], decision.getVoteDecisions)
routes.post('/vote/:vote_id', [check.isUser, check.isMember, check.getLangOption, check.getLangVote, check.hasDecided], decision.createVoteDecision)
routes.get('/vote/:vote_id/all', globalCheck.getLang, decision.getAllVoters)

// routes.get('/budget/:budget_id')
// routes.post('/budget/:budget_id', decision.create)



module.exports = routes