const validator = require('froncubator-validator-js')
const {sendErr} = require('../helper')
const {sendErrCreate} = require('../helper')
const userService = require('../services/user-services')

async function create(req, res) {

try {
	let name = req.body.name || ''
	let email = req.body.email || ''
	let age = +req.body.age || 0
	let error = ''

	console.log(req.body)
//валидация
	if(!validator.isStr(name, 0, 32))
		return sendErrCreate(res, 'ошибка в формате name. Поле name должно быть не более 32 символов', 'create')


	if(!validator.isEmail(email))
		return sendErrCreate(res, 'ошибка в формате email', 'create')

	if(!validator.isInt(age))
		return sendErrCreate(res, 'ошибка в формате age', 'create')
		 

//проверка, существет ли пользователь уже
	let found = await userService.findUser(name)
	console.log('нашли', found)
	if(!(found=='')) return sendErrCreate(res, 'пользователь уже существует', 'create')

//создание пользователя
	let user =  await userService.create({
		name,
		email,
		age
	})

	let users = await userService.get()
//выдача пользователя клиенту
	return res.render('create', {
		error: '',
		users: users
	})
} 	catch(err) {
	res.send('ошибка сервера')
	console.log(err)
	}

}
 
async function renew(req, res) {

	try{
		let name = req.body.name || ''
		let email = req.body.email || ''
		let age = +req.body.age || 0
	
		console.log(age)
	//валидация
		if(!validator.isStr(name, 0, 32))
			return sendErr(res, 'ошибка в формате name. Поле name должно быть не более 32 символов')
	
		if(!validator.isEmail(email))
			return sendErr(res, 'ошибка в формате email')
	
		if(!validator.isInt(age))
			return sendErr(res, 'ошибка в формате age')	

	
		//замена пользовательских данных
		let renewResult =  await userService.renewUser({
			name,
			email,
			age
		})

		console.log('renew result:', renewResult)

		if(renewResult.n==0) 
			res.send({msg: 'полльзователь с таким name не найден'})
		else if (renewResult.nModified==0) 
			res.send({msg: 'нечего изменять!'})
		else res.send({msg: 'все ок'})

	} 	catch(err) {
		res.send('ошибка сервера')
		console.log(err)
		}
}

async function remove(req, res) {
	try {
		let query = req.query
		if(query._id != undefined && !validator.isStr(query._id, 24, 24))
			return sendErr(res, 'ошибка в формате ай ди')

		let result = await userService.remove(query._id)
		console.log('@@@@', result)
		let users = await userService.get()
		return res.render('create', {
			users
		})

	} catch (err) {
		console.log(err)
		res.send('ошиька сервера')
	}

}

async function get(req, res) {
	try {
	// 	let name = req.params["name"] || ''

	// 	let found = await userService.findUser(name)
	// 	console.log('get нашел', found)
	// 	if(found=='') return sendErr(res, 'пользователь не существует')
	// 	res.send(found)

			console.log(req.query)
			let query = req.query
			if (query.age != undefined)
				query.age = +query.age || 0

			if (query.email != undefined && !validator.isEmail(query.email))
				return sendErr(res, 'ошибка в формате email')

			if (query.name != undefined && !validator.isStr(query.name, 0, 32))
				return sendErr(res, 'Ошибка в офрмате name')

			if (query.age != undefined && validator.isStr(query.age))
				return sendErr(res, 'Ошибка в формате возраста')

			let users = await userService.get(query)
			res.send(users)

		} catch(err) {
		res.send('ошибка сервера')
		console.log(err)
	}
}

module.exports = {
	create,
	renew,
	get,
	remove
}