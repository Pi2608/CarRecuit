const express = require('express')
const membershipController = require('../controllers/MembershipController')


const membershipRouter = express.Router()

membershipRouter.get('/', membershipController.getAllMembership)
membershipRouter.get('/:id', membershipController.getMembershipById)
membershipRouter.put('/update/:id', membershipController.updateMembershipById)

module.exports = membershipRouter
