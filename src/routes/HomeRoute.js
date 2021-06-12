const {Router} = require('express')
const UserMiddleware = require('../middlewares/UserMiddleware')
const {findMyFollowers} = require('../models/FollowerModel')
const {findMyFollowings} = require('../models/FollowerModel')
const {deleteFollower} = require('../models/FollowerModel')
const {addFollower} = require('../models/FollowerModel')
const {findFollower} = require('../models/FollowerModel')
const router = Router()
const upload = require('express-fileupload')
const fs = require('fs').promises
const fsOld = require('fs')
const path = require('path')
const {findUserOne} = require('../models/UserModel')
router.use(UserMiddleware)
       
router.get('/'  ,UserMiddleware, async  (req,res) => {
let findedUser = await findUserOne(req.user.username)
const PhotoPath = path.join(__dirname , '..' , 'public' , 'avatar' , `${findedUser._id}.jpg`)
let isExist = fsOld.existsSync(PhotoPath)
	res.render('index' , {
       user:findedUser,
       thisUser: req.user,
       title:"Home page",
       photo:isExist,
       path:'/profile'
	})
})

router.get('/followers' , async(req,res)=>{
try {
	const {username} = req.query
	let {_id} = await findUserOne(username)
    let followers = await findMyFollowers(_id)
    followers = followers.map(follower => {
    	const PhotoPath = path.join(__dirname , '..' , 'public' , 'avatar' , `${follower.user_id}.jpg`)
        let isExist = fsOld.existsSync(PhotoPath)
        return {
        	id: follower.user[0]._id,
        	name: follower.user[0].name,
        	username: follower.user[0].username,
        	isExist:isExist,
        }
    })

    res.render('/followers' ,async (req , res) =>{
        followers:followers
    })
 console.log(followers);
} catch(e) {
    res.status(400).send({
    	ok:false
    })
}
})

router.post('/follow'  ,UserMiddleware, async  (req,res) => {
try {
	const {username:followUsername} = req.body 
    const {username:userUsername} = req.user
let {_id: user_id} = await findUserOne(userUsername)
let {_id: follow_id} = await findUserOne(followUsername)
let followOld = await findFollower(user_id , follow_id)
// console.log(followOld);
if(followOld) {
	await deleteFollower(user_id, follow_id)
} else{
    await addFollower(user_id , follow_id) 
}

res.status(200).send({
	ok:true,
	message:'Following created',
	followOld: followOld ? true : false
})
} catch(e) {
  res.status(400).send({
  	message:"Bad Request",
    ok:false
  })
}
})


router.post('/photo' , upload({size: 1024 * 10 * 1024}),async (req, res) => {
   try {
        let findedUser = await findUserOne(req.user.username)
        const PhotoPath = path.join(__dirname , '..' , 'public' , 'avatar' , `${findedUser._id}.jpg`)
        const fileStream = await fs.writeFile(PhotoPath , req.files.photo.data)
        res.send({
	      ok:true
        })
    } catch(e) {
    	console.log(e);
        res.send({
        	ok:false
        })
    } 
})

router.get('/:username'  ,UserMiddleware, async  (req,res) => {
const {username} = req.params
let findedUser = await findUserOne(username)
let followers = await findMyFollowers(findedUser._id)
const {username:userUsername} = req.user
let {_id: user_id} = await findUserOne(userUsername)
let followOld = await findFollower(user_id , findedUser._id)
const PhotoPath = path.join(__dirname , '..' , 'public' , 'avatar' , `${findedUser._id}.jpg`)
let isExist = fsOld.existsSync(PhotoPath)

	res.render('index' , {
       user:findedUser,
       title:"Home page",
       photo:isExist,
       path:'/profile',
       thisUser: req.user,
       oldFollow: followOld ? true : false
	})
})


module.exports = {
path:['/profile'],
router: router
}