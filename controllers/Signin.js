const handleSignIn = (db,bcrypt,saltRounds) => (req,res) => {
	const {email, password} = req.body;
	if (!email || !password) {
	return res.status(400)
	.json('unable to sign-in, verifiy your login information')
	} 
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
    		if (isValid) {
    			return db.select('*').from('users')
    			.where('email','=', email)
    			.then( user => {
    				res.json(user[0])
    			})
    			.catch(err => res.status(400).json('unable to signin'))
    		} else {
    			res.status(400).json('your password is wrong')
    		}
		})
		.catch(err => {
			res.status(400).json('your credentials are wrong')
		})
}




module.exports = {
	handleSignIn: handleSignIn
}