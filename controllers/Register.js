const handleRegister = (db,bcrypt,saltRounds)=> (req,res) => {
	const {email, name, password} = req.body;
	if (!email || !name || !password) {
	return res.status(400)
	.json('unable to register, verifiy every field please')
	} 
	bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
       // for register we will use transaction, we want to register
	// the values first in our login table, then make the transa
	// ction to our users table, in this case transfer our Email
	// if something goes wrong we want to rollback every
	// thing we did, with a catch following (trs.commit), but if 
	// everything goes right in the end.. well we want to commit 
	// everyting
		db.transaction( trs => {
			trs.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trs('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(response => {
						res.json(response[0]);
					})
			})
			.then(trs.commit)
			.catch(trs.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
    })
});
}

module.exports = {
	handleRegister: handleRegister
};