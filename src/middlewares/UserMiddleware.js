const {checkToken} = require('../modules/jwt')

module.exports = async (req , res , next)=> {
 let token = req.cookies ? req.cookies.token : ''
 token = checkToken(token)
 if(!token){
 	res.redirect('/signup')
 	return 0
 } else {
 	req.user = token
 }
 next()
}