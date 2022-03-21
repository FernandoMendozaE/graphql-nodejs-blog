const { Schema, model } = require('mongoose') // ! import mongoose

// * Creación del esquema
const postSchema = new Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ? Crea dos campos de fecha de creación y actualización
    // versionKey: false, // ? Desactiva la versión del esquema
  }
)

module.exports = model('Post', postSchema) // ! export model
