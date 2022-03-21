const { GraphQLList, GraphQLID } = require('graphql') // ! Importamos GraphQLList
const { UserType, PostType, CommentType } = require('./typedef') // ! Importamos nuestros tipos de datos
const { User, Post, Comment } = require('../models')

// ? Type: es una propiedad que nos permite definir el tipo de dato que vamos a utilizar, description: es una propiedad que nos permite definir una descripcion del tipo de dato que vamos a utilizar, resolve: es una propiedad que nos permite resolver los datos que vamos a utilizar

// * Función para obtener todos los usuarios
const users = {
  type: new GraphQLList(UserType), //? GraphQLList: es una propiedad que nos permite definir una lista de datos que vamos a utilizar en este caso una lista de usuarios
  async resolve() {
    const users = await User.find() // ? find: es una propiedad que nos permite buscar los usuarios

    return users
  },
}

// * Función para obtener un usuario
const user = {
  type: UserType,
  decription: 'Get a user by id',
  args: {
    id: { type: GraphQLID },
  },
  resolve(_, args) {
    return User.findById(args.id)
  },
}

// * Función para obtener todos los posts
const posts = {
  type: new GraphQLList(PostType),
  description: 'Get all posts',
  resolve: () => Post.find(),
}

// * Función para obtener un post
const post = {
  type: PostType,
  description: 'Get a post by id',
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) => Post.findById(id),
}

// * Función para obtener todos los comentarios
const comments = {
  type: new GraphQLList(CommentType),
  description: 'Get all comments',
  resolve: () => Comment.find(),
}

// * Función para obtener un comentario
const comment = {
  type: CommentType,
  description: 'Get a comment by id',
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) => Comment.findById(id),
}

module.exports = { users, user, posts, post, comments, comment }
