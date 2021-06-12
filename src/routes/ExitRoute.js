const {Router} = require('express')
const router = Router()

router.get('/'  , (req,res) => {
res.clearCookie('token').redirect('/login')
})

module.exports = {
path:'/exit',
router: router
}