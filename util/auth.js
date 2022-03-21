const jwt = require('jsonwebtoken') // ! importamos el modulo jsonwebtoken

// * Método para crear un token
const createJWToken = user => {
  // ? .sing() es el método que genera el token los cuales tienen como parametros el payload el cual es un objeto que contiene los datos que queremos que sean visibles en el token y el segundo parametro es la clave secreta
  return jwt.sign({ user }, 'faztxyz123', {
    expiresIn: '1h',
  })
}

module.exports = {
  createJWToken,
}
