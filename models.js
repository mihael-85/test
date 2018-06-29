const mongoose = require('mongoose');
const models = {}

models.User = mongoose.model('User', {
	name: String,
	email: String,
	age: Number,
	created_at: {type: Date, default: Date.now}
})

models.Post = mongoose.model('Post', {
	title: String,
	text: String,
	created_at: {type: Date, default: Date.now}
})

module.exports = models