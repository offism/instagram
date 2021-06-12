const Express = require('express')
const application = Express()
const CookieParser = require('cookie-parser')
const Fs = require('fs')
const Path = require('path')
require('dotenv').config({path:Path.join(__dirname , '.env')})

const PORT = process.env.PORT

if(!PORT) throw new ReferenceError('PORT is not defined')


// middlewares
application.use(Express.json())
application.use(Express.urlencoded({extended:true}))
application.use(CookieParser())

//settings
application.listen(PORT , () => { console.log(`Server is ready in PORT:${PORT}`); })
application.set('view engine' , 'ejs')
application.set('views' , Path.join(__dirname ,'views'))

application.use('/public' , Express.static(Path.join(__dirname , 'public')))

//routes
const RoutesPath = Path.join(__dirname , 'routes')

Fs.readdir(RoutesPath , (err , files)=>{
	if(err) throw new Error(err)
    files.forEach(route => {
    const RoutePath = Path.join(__dirname , 'routes' , route)
    const Route = require(RoutePath)
    if(Route.path && Route.router) application.use(Route.path, Route.router)
})
})