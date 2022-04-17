const jwt = require('jsonwebtoken')
// * Método que valida si el usuario está autenticado
const authenticate = (req, res, next) => {
  // ! ejemplo del token al enviar Bearer kdlkldakdlsad...
  const token = req.headers.authorization?.split(' ')[1] // ? obtenemos el token del header

  try {
    const verified = jwt.verify(token, 'faztxyz123') // ? verificamos el token
    req.verifieUser = verified.user // ? agregamos el usuario a la request
    next()
  } catch (error) {
    console.error(error)
    next()
  }
}

module.exports = {
  authenticate
}
