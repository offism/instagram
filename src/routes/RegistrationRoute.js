const {Router} = require('express')
const {createUser} = require('../models/UserModel')
const {updateDate} = require('../models/UserModel')
const {findUser} = require('../models/UserModel')
const {findUserOne} = require('../models/UserModel')
const Joi = require('joi')
const {generateHash} = require('../modules/bcrypt')
const {generateToken} = require('../modules/jwt')
const router = Router()
// const AuthMiddleware = require('../middlewares/AuthMiddleware')

// router.use(AuthMiddleware)

//validation JOI
const RegistrationValidation = new Joi.object({
	phone: Joi.number()
	.min(10000)
	.max(999999999999)
	.error(new Error ('Phone number is incorrect'))
	.required(),
    name: Joi.string()
    .min(3)
	.max(32)
	.error(new Error ('Name is incorrect'))
	.required(),
	username: Joi.string()
	.alphanum()
    .min(6)
	.max(16)
	.error(new Error ('Username is incorrect'))
	.required(),
	password: Joi.string()
	.min(6)
	.max(32)
	.error(new Error ('Password is incorrect'))
	.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
	.required(),
})

const BirthDate = new Joi.object({
	bmonth: Joi.string()
	.required()
	.trim()
	.error(new Error("Birth month is incorrect")),
	bday: Joi.string()
	.required()
	.min(1)
	.max(31)
	.error(new Error("Birth day is incorrect")),
	byear: Joi.string()
	.required()
	.error(new Error("Birth year is incorrect")),
})

router.get('/' ,(req,res) => {
	res.render('registration',{
		title: 'Registration'
	})
})

router.post('/' , async (req,res)=>{
try {
  	const {phone , name , username , password} = await RegistrationValidation.validateAsync(req.body)
	let passwordGen = await generateHash(password)
    let user = await createUser(phone , name , username ,passwordGen)
    let u = await findUserOne(username)
    let token = generateToken({
    	name:user.name,
    	username:user.username,
    	_id:u._id
    })
    res.cookie('token' , token).redirect('/signup/bdate')
    
} catch(e) {
	if(String(e).includes('duplicate key error')){
		e = "Phone or Username already is taken"
	}
    res.render('registration',{
    	title: 'Registration',
    	error: e + ""
    })
}

})

router.get('/bdate'  ,  async (req,res)=> {
   res.render('bdate' , {
   	title: 'User Birthday page'
   })
})

router.post('/bdate', async  (req, res)=> {
   try {
   	let data = await BirthDate.validateAsync(req.body)
    let users = await findUser()
    for (let user of users) {
    let  update = await updateDate(user._id , data)
    res.redirect('/profile')
    }
   } catch(e) { 
   	res.render('bdate' , {
   	error: e + "",
   	title: 'User Birthday page'
   })
   }
})


module.exports = {
path:'/signup',
router: router
}