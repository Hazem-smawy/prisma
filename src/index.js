const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()


const verifyToken = (req, res, next) => {

    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err, authData) => {
            if (err) return res.sendStatus(403)

            req.userId = authData.id
            next()
        })
       

    } else {
        res.sendStatus(403)
    }

}
app.use(express.json())
app.use(cookieParser())

app.use('/auth', require('./route/auth_route'))
app.use('/users', require("./route/user_route.js"))


app.get('/',(req,res)=> {
    res.json({"message":"it is successfully connect"})
})


const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log(`it is running in port:${port} `)
})