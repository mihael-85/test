const models  = require('../models')

async function create(postObject) {
	const post = new models.Post(postObject)
	await post.save()
	return post
}

async function findPost(postObject) {
	// let titleObj = {title}
	let foundPost = await models.Post.find({_id: postObject})
	return foundPost
}

async function renewPost(postObject) {
	// let name = user
	let result = await models.Post.update({_id: postObject.ID}, postObject)
	return result
}

async function deletePost(ID) {
	let argument = { "_id" : ID}
	let result = await models.Post.deleteOne(argument)
	return result
}

module.exports = {
	create,
	findPost,
	renewPost,
	deletePost
}