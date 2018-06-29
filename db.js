const mongoose = require('mongoose');
let db = mongoose.connection

function connectToDB() {
	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://localhost.:27017/test');
		db.on('error', function(err){
			console.log(err);
			setTimeout(function(){
				connectToDB()
			}, 5000)
		});
		
		db.once('open', async function(){
			console.log('everything is ok');
			resolve(true);
		})
	}
)
}

module.exports = {
	connectToDB
}