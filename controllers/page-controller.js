const userService = require('../services/user-services')
const validator = require('froncubator-validator-js')
const {sendErr} = require('../helper')
var ObjectID = require('mongodb').ObjectID


async function indexPage(req, res) {
	try {
		let users = await userService.get()
		res.render('create', {
			users
		})
	} catch(err) {
		console.log('error: ', err)
		res.send('error of server!')
	}
}

async function createPage(req, res) {
	try {

		let name = req.body.name || ''
		let email = req.body.email || ''
		let age = +req.body.age || 0

		let user =  await userService.create({
			name,
			email,
			age
		})
		console.log('222222', user)

		let errors = ''
		let none = ''
		console.log('&&&', req.query)
		let users = await userService.get(req.query)
		res.render('create', {
			errors, none, users
		})
	} catch(err) {
		console.log('error: ', err)
		res.send('error of server!')
	}
}

async function deletePage(req, res) {
	try {
		let users = await userService.get(req.query)
		res.render('home', {
			users
		})
	} catch(err) {
		console.log('error: ', err)
		res.send('error of server!')
	}
}



async function renewPage(req, res) { 
	let user = {}
	user._id = req.query._id
	user.name = req.query.name
	user.email = req.query.email
	user.age = req.query.age
	console.log ('fffff',req.query)
	res.render('renew', {
		user
	})
}


async function renewUser(req, res) {

	try{
		let	id = req.body.id
		let name = req.body.name || ''
		let email = req.body.email || ''
		let age = +req.body.age || 0
	
		console.log('id :', id)
	//валидация
		if(!validator.isStr(name, 0, 32))
			return sendErrCreate(res, 'ошибка в формате name. Поле name должно быть не более 32 символов')
	
		if(!validator.isEmail(email))
			return sendErrCreate(res, 'ошибка в формате email')
	
		if(!validator.isInt(age))
			return sendErrCreate(res, 'ошибка в формате age')	

	
		//замена пользовательских данных
		let renewResult =  await userService.renewUser( id , {
			name,
			email,
			age
		})

		console.log('renew result:', renewResult)

		if(renewResult.n==0) 
			res.send({msg: 'полльзователь с таким name не найден'})
		else if (renewResult.nModified==0) 
			res.send({msg: 'нечего изменять!'})
		else {
			let users = await userService.get()
			return res.render('create', {
				error: '',
				users: users
			})
		}	

	} 	catch(err) {
		res.send('ошибка сервера')
		console.log(err)
		}
}



module.exports = {
	indexPage,
	createPage,
	deletePage,
	renewPage,
	renewUser
}