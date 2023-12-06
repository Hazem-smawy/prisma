const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const Joi = require('joi')
const express = require('express')

const router = express.Router()
const prisma = new PrismaClient()


// const verifyToken = (req, res, next) => {

//     const bearerHeader = req.headers['authorization']
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(" ");
//         const token = bearer[1];

//         req.token = token
//         next()

//     } else {
//         res.sendStatus(403)
//     }

// }

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



router.post('/',async (req, res) => {

   

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









router.put('/:id', async (req, res) => {


    

        const { error, value } = userSchema.validate(req.body)

        if (error) {
            return res.status(418).send({ "message": `there is some error : ${error}` })

        } else {
            const { firstName, lastName, email } = value

            try {

                const user = await prisma.user.update({
                    where: {
                        id:req.userId ,
                    },
                    data: {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                    }
                })

                res.status(200).json({ user})

            } catch (error) {
                return res.status(400).json({ "message": "the email is uniqe" })

            }


        }
    









})

router.get('/', async (req, res) => {
    // await prisma.testResult.deleteMany({})
    // await prisma.courseEnrollment.deleteMany({})
    // await prisma.test.deleteMany({})
    // await prisma.user.deleteMany({})
    // await prisma.course.deleteMany({})
    const users = await prisma.user.findMany({})
    res.json(users)
})


module.exports = router
