const Schema = require('mongoose').Schema
const {client} = require('../modules/mongo')

const FollowerSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId
    },
    follow_id:{
        type: Schema.Types.ObjectId,
        required: true
    }
})

async function FollowerModel (){
     let db = await client()
     return await db.model('followTable' , FollowerSchema)
}
async function addFollower(user_id , follow_id){
    let model = await FollowerModel()
    return await model.create({user_id:user_id, follow_id:follow_id})  
    
}

async function deleteFollower(user_id , follow_id){
    let model = await FollowerModel()
    return await model.deleteOne({user_id:user_id, follow_id:follow_id} )  
    
}

async function findFollower(user_id , follow_id){
    let model = await FollowerModel()
    return await model.findOne({user_id:user_id , follow_id:follow_id})
}

async function findMyFollowers(user_id){
    let model = await FollowerModel()
    return await model.aggregate([
         {
            $match:{
                follow_id: user_id
            }
         },
         {
            $lookup:{
                from:'users',
                localField: 'user_id',
                foreignField: '_id',
                as:'user'
            }
         }
        ])
}
async function findMyFollowings(user_id){
    let model = await FollowerModel()
    return await model.find({follow_id:user_id})
}

module.exports ={
     addFollower, deleteFollower, 
     findMyFollowers , findMyFollowings , findFollower
}