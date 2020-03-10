const Clarifai = require('clarifai'); 
const app = new Clarifai.App({
 apiKey: '24d614c85a534713a28614e9e4846e0b'
});

const handleApiCall = (req,res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, 
      req.body.imageUrl)
	.then(data => {
		res.json(data)
	})
	.catch(err => res.status(400).json('unable to work with Smart API'))
}

const handleImageEntries = (db)=>(req,res) => {
		const { id } = req.body;
		db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			if(entries >= 1){
				res.json(entries[0])
			} else {
				res.status.json('unable to identify user id')
			}
		})
		.catch(err => {
			res.status(400).json('unable to get user id')
		})
};


module.exports = {

	handleImageEntries: handleImageEntries,
	handleApiCall: handleApiCall
};