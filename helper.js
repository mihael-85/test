const helper = {}
const userService = require('./services/user-services')


helper.sendErr = function(res, message) {
	return res.send({
		err: message
	})
}


helper.sendErrCreate = async function(res, message, type) {
	let users = await userService.get()
	return res.render(type, {
		error: message,
		users: users
	})
}

module.exports = helper