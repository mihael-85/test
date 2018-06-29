const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

const {connectToDB} = require('./db')


const userController = require('./controllers/user-controller')
const postController = require('./controllers/post-controller')
const pageController = require('./controllers/page-controller')



connectToDB()



const app = express()

nunjucks.configure('./views', {
	autoescape: true,
	express: app,
	noCache: true,
	tags: {
		variableStart: '<#',
		variableEnd: '#>'
	}
});

app.set('view engine', 'njk')

app.use(cookieParser())
app.use(bodyParser.json({limit: '50Mb'}))
app.use(bodyParser.urlencoded({limit: '50Mb', extended:'true'}))


app.get('/', pageController.indexPage)
app.post('/create_user', userController.create)
app.post('/userdel', userController.remove)
app.post('/renew_user_page', pageController.renewPage)
app.post('/renew_user', pageController.renewUser)



app.post('/api/v1/user', userController.create)
app.put('/api/v1/user', userController.renew)
app.post('/api/v1/userdel', userController.remove)
app.get('/api/v1/user', userController.get)


app.post('/api/v1/post/create', postController.create)
app.put('/api/v1/post/renew', postController.renew)
app.delete('/api/v1/post/delete', postController.destroy)
app.get('/api/v1/post/get/:ID', postController.getPost)



app.listen('3333');