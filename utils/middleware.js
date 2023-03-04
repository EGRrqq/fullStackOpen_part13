const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { User} = require('../models')

const errorHandler = (error, req, res, next) => {
    if (error.name==='SequelizeValidationError') {
      return res.status(400).send({error: error.message})
    } else if (error.name==="SequelizeDatabaseError") {
      return res.status(400).send(`Error: ${error.message}`)
    } 
  
    next(error)
}
  
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }

  const user = await User.findByPk(req.decodedToken.id)

  console.log(user.disabled)
  if (user.disabled) {
    return res.status(401).json({
      error: 'token expired',
    })
  }

  next()
}

module.exports = {
    errorHandler,
    unknownEndpoint,
    tokenExtractor
}