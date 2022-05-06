const routes = require('express').Router()
const decision = require('../controllers/decision.controller')
const check = require('../middlewares/decisionCheck')

routes.get('/vote/:vote_id', [check.isUser, check.getLangVote], decision.getVoteDecisions)
routes.post('/vote/:vote_id', [check.isUser, check.isMember, check.getLangOption, check.getLangVote, check.hasDecided], decision.createVoteDecision)

// routes.get('/budget/:budget_id')
// routes.post('/budget/:budget_id', decision.create)



module.exports = routes