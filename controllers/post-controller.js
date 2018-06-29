const validator = require('froncubator-validator-js')
const postService = require('../services/post-services')
const {sendErr} = require('../helper')


async function create(req, res) {

try {
	let title = req.body.title || ''
	let text = req.body.text || ''

//валидация
	if(!validator.isStr(title, 0, 50))
		return sendErr(res, 'ошибка в формате title. Поле title должно быть не более 50 символов')

	if(!validator.isStr(text, 0, 150))
		return sendErr(res, 'ошибка в формате text. Поле text должно быть не более 150 символов')


//создание поста
	let post =  await postService.create({
		title,
		text
	})

	console.log('вы создали пост с ID: ' , post._id)
//выдача поста клиенту
	res.send(post)

} 	catch(err) {
	res.send('ошибка сервера')
	console.log(err)
	}

}


async function renew(req, res) {

	try{
		let title = req.body.title || ''
		let text = req.body.text || ''
		let ID = req.body.ID
	
	//валидация
		if(!validator.isStr(title, 0, 50))
			return sendErr(res, 'ошибка в формате title. Поле name должно быть не более 32 символов')
	
		if(!validator.isStr(text, 0, 150))
			return sendErr(res, 'ошибка в формате text. Поле name должно быть не более 150 символов')
	
		// if(!(ID==parseInt(ID))) return sendErr(res, 'ошибка в формате ID')
	
	
		//замена  данных поста
		let renewResult =  await postService.renewPost({
			title,
			text,
			ID
		})

		console.log('renew result:', renewResult)

		if(renewResult.n==0) res.send({msg: 'пост с таким ID не найден'})
		else if (renewResult.nModified==0) res.send({msg: 'нечего изменять!'})
		else res.send({msg: 'все ок'})

	} 	catch(err) {
		res.send('ошибка сервера')
		console.log(err)
		}
}


async function destroy(req, res) {

	let title = req.body.title || ''
	let text = req.body.text || ''
	let ID = req.body.ID || 0

	let deleted = await postService.deletePost(ID)
	console.log ('результат : ', deleted)
	if (deleted.n==0) res.send({msg: 'пост с таким ID не найден'})
	else res.send({msg: 'пост удален'})
}

async function getPost(req, res) {
	try{
		let ID = req.params["ID"] || ''

		let found = await postService.findPost(ID)
		console.log('get нашел', found)
		if(found=='') return sendErr(res, 'пост не существует')
		res.send(found)
	} catch(err) {
		res.send('ошибка сервера')
		console.log(err)
	}
}


module.exports = {
	create,
	renew,
	destroy,
	getPost
}