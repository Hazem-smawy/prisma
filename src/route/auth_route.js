


const express = require('express')

const { PrismaClient } = require('@prisma/client')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const prisma = new PrismaClient()
const router = express.Router()
const Joi = require('joi')

router.post('/register',async(req,res) => {
    const userSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
            .email()
            .required(),
        social: Joi.object({
            facebook: Joi.string().optional(),
            twitter: Joi.string().optional(),
            github: Joi.string().optional(),
            website: Joi.string().optional(),
        }).optional(),
    })
    const { error, value } = userSchema.validate(req.body)

    if (error) {
        return res.status(418).send({ "message": `there is some error : ${error}` })

    } else {
        const { firstName, lastName, email } = value

        try {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                }
            })
            return res.status(200).json({ user })
        } catch (error) {
            return res.status(400).json({ "message": "the email is uniqe" })

        }


    }
})

router.post('/login',async(req,res)=> {
    const loginSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
    });
    const {error ,value} = loginSchema.validate(req.body)
    if(error) return res.status(400).json({"message":"the data is not correct"})
   
    try {
       const loginUser  = await prisma.user.findUnique({
            where: { email: value.email  }
        })
       

        const accessToken = jwt.sign(
                { "id":loginUser.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn:'1d' }
            )
        const refreshToken = jwt.sign(
                    { "id":loginUser.id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn:'1d'}
        )
        try {
          await  prisma.user.update({
                data:{ tokens:refreshToken },
                where:{  id:loginUser.id }
            })
        } catch (error) {
            res.sendStatus(404)
        }
        res.cookie('jwt',refreshToken, {httpOnly:true,sameSite: 'None',secure:true,maxAge: 24 * 60*60 * 1000})    
   
        res.json({ accessToken  })
    

    } catch (e) {
        return res.status(400).json({"message":"there is no member in database"})
    }


   
})
const handelRefreshToken = async  (req,res)=> {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    try {

        const foundUser = await prisma.user.findFirst({
           
            where:{
                tokens:refreshToken
            }
        })
        console.log(foundUser)

        if(!foundUser) return res.sendStatus(401)
        jwt.verify(
            foundUser.tokens,
            process.env.REFRESH_TOKEN_SECRET,
            (err,decoded) => {
                if(err || decoded.id !== foundUser.id) return res.sendStatus(403)
                const accessToken = jwt.sign(
                    { "id":decoded.id},
                   process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'1d'}
                ) 

                res.json({accessToken})
            }
        )

    }catch (e){
        res.json({"message":"there is no refresh token in database"})
    }
}

router.get('/',handelRefreshToken)
//? log out


const handelLogout = async  (req,res)=> {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    try {

        const foundUser = await prisma.user.findFirst({
           
            where:{
                tokens:refreshToken
            }
        })

        await prisma.user.update({
            data :{tokens: null},
            where: {
                id: foundUser.id
            }
        })

        res.sendStatus(204)
        

      
       

    }catch (e){
        
            res.clearCookie('jwt',{httpOnly:true,sameSite: 'None',secure:true,maxAge: 24 * 60*60 * 1000})
            return res.sendStatus(204)
        
    }
}

router.get('/logout',handelLogout)
module.exports = router





 


