const Organization = require('../models/Organization')

const initialOrganizations = [
	{
		name: 'Dao Mazen',
        slug: 'dao-mazen',
		image: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm',
        creator: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo',
        joinCriteria: '6283762e2f335a6df2c71901',
        budgetCriteria: '6283762e2f335a6df2c71905',
        address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvsyrtwevrap',
        hash: '13467859453662759606374521637484558599684623349201647366263674748574478818345630322',
	},
	{
		name: 'Dao Midas touch',
        slug: 'dao-midas-touch',
		image: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm',
        creator: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo',
        joinCriteria: '6283762e2f335a6df2c71901',
        budgetCriteria: '6283762e2f335a6df2c71905',
        address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvsyrtwevwap',
        hash: '13467859453662759606374521637484558599684623349201647366265688748574478818345630322',
	}
]

const initialUsers = [

	{
		address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo'
	},

	{
		address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTcsp',
	}

]

const nonExistingId = async () => {
	const organization = new Organization({
		title: 'Dao-Midas',
		image: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm',
        creator: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo',
        joinCriteria: '6283762e2f335a6df2c71901',
        budgetCriteria: '6283762e2f335a6df2c71905',
        address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvsyrtwevwap',
        hash: '13467859453662759606374521637484558599684623349201647366265688748574478818345630322',
	})
	await organization.save()
	await organization.remove()

	return organization._id.toString()
}

const organizationsInDb = async () => {
	const organizations = await Organization.find({})
	return organizations.map(org => org.toJSON())
}

module.exports = {
	initialOrganizations,
	nonExistingId,
	organizationsInDb,
	initialUsers
}