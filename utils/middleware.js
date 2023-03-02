const errorHandler = (error, req, res, next) => {
    if (error.name==='SequelizeValidationError') {
      return res.status(400).send({error: error.message})
    } else if (error.name==="SequelizeDatabaseError") {
      return res.status(400).send(`Error: ${error.message}`)
    } 
  
    next(error)
  }
  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    errorHandler,
    unknownEndpoint
}