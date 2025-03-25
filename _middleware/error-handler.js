module.exports = errorHandler

function errorHandler(err, req, res, next){
  switch(true){
    case typeof err === 'string':
      const is404 = err.toLowerCase().endsWith('not found')
      const statusCode = is404 ? 404 : 400
      return res.status(statusCode).json({ message: err })  

    case err.name === 'UnathorizedError':
      return res.status(401).json({ msg: 'Unauthorized'})

    default:
        return res.status(500).json({ message: err.message })
  }
}