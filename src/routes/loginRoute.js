const {Router} = require('express')
// const UserMiddleware = require('../middlewares/UserMiddleware')
const router = Router()
const Joi = require('joi')
const {findUserOne} = require('../models/UserModel')
const {confirmHash} = require('../modules/bcrypt')
let {generateToken} = require('../modules/jwt')

// router.use(UserMiddleware)

const LoginValidation = new Joi.object({
	login: Joi.string()
	.required()
	.alphanum()
	.error(new Error(`Login is incorrect`)),
	password: Joi.string()
	.required()
	.error(new Error ('Password is incorrect'))
	.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})
router.get('/'  , (req,res) => {
	res.render('login' , {
       title:"Login page",
	})
})

router.post('/' ,async (req, res)=>{
    try {
    	let data = await LoginValidation.validateAsync(req.body)
        let user 
        let phone_number = Number(data.login)
        if(isNaN(phone_number)){
        	user = await findUserOne(data.login)
        } else {
        	user = await findUserOne(phone_number)
        }
  
        if(!user){
        	throw  (`User not found`)
        }
        let isTrust =await confirmHash(data.password , user.password)
        if(!isTrust){
        	throw (`Password is incorrect`)
        	res.redirect('/login')
        }
    let token = generateToken({
    	name:user.name,
    	username:user.username,
    })

    	res.cookie('token' , token).redirect('/profile')
    } catch(e) {
    	res.render('login' , {
    		title:"Login page",
    		error: e + ""
    	})
    }
})
module.exports = {
path:'/login',
router: router
}