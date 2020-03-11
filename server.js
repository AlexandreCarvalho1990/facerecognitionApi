const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('knex');
const register = require('./controllers/Register');
const signIn = require('./controllers/Signin');
const profile = require('./controllers/Profile');
const imageEntries = require('./controllers/ImageEntries');
const db= knex({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    ssl: true,
  }
});
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.get('/', (req, res)=>{
  res.send('it is working');
	// db.select('*').from('users')
	// .then(result =>{
	// 	res.send(result)
	// })
})
app.post ('/signin', signIn.handleSignIn(db,bcrypt,saltRounds));
app.post ('/register', register.handleRegister(db,bcrypt,saltRounds));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', imageEntries.handleImageEntries(db));
app.post('/imageurl', imageEntries.handleApiCall);

app.listen(process.env.PORT || 3000, ()=>{
	console.log(`Server running on port ${process.env.PORT}`)
})


/*
--> res = this is working
/signin ---> Post = Sucess/Fail -- Working
/register ---> Post = user -- Working
/profile/:userId ---> GET = user -- Working
/image ---> PUT ---> user -- Working
/imageurl ---> post = clarifai object-- Working
*/