const { Schema, model } = require('mongoose')

// * Creamos el esquema de nuestra base de datos
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // ? select: false es para que no se muestre en la respuesta
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Provide a valid email address',
      ], // ? match: es una expresion regular que nos permite validar que el email sea valido
    },
    diplayName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ? timestamps: es una propiedad que nos permite crear una fecha de creacion y una de actualizacion
    versionKey: false, // ? versionKey: es una propiedad que nos permite desactivar la version de nuestra base de datos
  }
)

module.exports = model('User', userSchema)
