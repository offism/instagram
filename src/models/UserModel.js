const Schema = require('mongoose').Schema
const {client} = require('../modules/mongo')
const FollowerSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId
    }
})
const UserSchema = new Schema({
	phone:{
		type: Number,
        required: true,
        unique:true,
        },
    name:{
		type: String,
        required: true,
        },
    username:{
		type: String,
		unique:true,
        required: true,
        lowercase:true
        },      
    password:{
		type: String,
        required: true,
        },
    bdate:{
        bmonth:{
        type: String,
        },
        bday:{
        type: Number,
        },
        byear:{
        type: Number,
        },
    },
   
})


async function UserModel (){
     let db = await client()
     return await db.model('users' , UserSchema)
}

async function findUser(){
    let model = await UserModel()
    return await model.find()
}
async function findUserOne(login){
    let obj = ((typeof login) == 'string') ? { username: login} : {phone: login}
    let model = await UserModel()
    return await model.findOne(obj)
}
async function createUser(phone,name,username,password){
   
    if(!(username && password)){
        throw new ReferenceError(`Username or Password not found`)
    }

	let model = await UserModel()
    let data =  await model.create({ phone,name,username,password })
    await data.save()
    return data
}

async function updateDate (objectId , bdate) {
    let model = await UserModel()
    return await model.updateOne({_id:objectId} , {bdate:bdate})
}

module.exports ={
     createUser, updateDate , findUser , findUserOne
}