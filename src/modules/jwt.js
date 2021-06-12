const JWT = require('jsonwebtoken')

const Path = require('path')
require('dotenv').config({path:Path.join(__dirname , '.env')})
let SECRET_WORD = process.env.SECRET_WORD
function generateToken(data){
   let token = JWT.sign(data , SECRET_WORD)
   return token
}

function checkToken(token){
   try {
   	let data = JWT.verify(token , SECRET_WORD)
   return data
   } catch(e) {
   return false
   }
 }

module.exports = {
	generateToken , checkToken
}
