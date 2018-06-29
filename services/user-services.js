const models  = require('../models')

async function create(userObject) {
		const user = new models.User(userObject)
		await user.save()
		return user

}

async function findUser(name) {
	let nameObj = {name}
	let foundUser = await models.User.find(nameObj)
	return foundUser
}

async function renewUser(userObject) {
	// let name = user
	let result = await models.User.update({name: userObject.name}, userObject)
	return result
}

async function deleteUser(name) {
	let result = await models.User.deleteOne(name)
	return result
}

async function remove(id) {
	let user = await models.User
		.deleteOne({ _id: id})

	return(user)
}

async function get(query = {}) {

	let page = 0
	if(query.page) {
		if (query.page < 0)
			query.page = 0
		page = query.page
		delete query.page
	}

	if(query.name)
		query.name = new RegExp(query.name, 'gi')

	let users = await models.User
		.find(query)
		// .limit(2)
		// .skip(page * 2)

		return users
}

module.exports = {
	create,
	findUser,
	renewUser,
	remove,
	get
}