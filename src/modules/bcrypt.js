const bcrypt = require('bcrypt')

async function generateHash(data){
  let solt = await bcrypt.genSalt(10)
  let crypt = await bcrypt.hash(data , solt)
  return crypt 
}

async function confirmHash(data , hash){
  return await bcrypt.compare(data , hash)
}

module.exports = {
	generateHash , confirmHash
}