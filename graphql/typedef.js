// * El archivo typedes.js es una libreria de tipos de datos para GraphQL el cual nos permite definir los tipos de datos que vamos a utilizar, en este caso definimos el tipo de dato que vamos a utilizar en nuestra query
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require('graphql') // ! Importamos los tipos de datos que vamos a utilizar de graphql
const { User, Post, Comment } = require('../models') // ! Importamos el modelo de usuario

// ? Creamos una clase que nos permite crear un tipo de dato, name: es el nombre del tipo de dato, description: es la descripcion del tipo de dato, fields: es un objeto que contiene todas las definiciones de los campos que vamos a utilizar, resolve: es una función que nos permite resolver los datos que vamos a utilizar
const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'The user type',
  fields: () => ({
    id: { type: GraphQLID }, // ? GraphQLID define el tipo de dato ID
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    diplayName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
})

const PostType = new GraphQLObjectType({
  name: 'PostType',
  description: 'The post type',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent) {
        // ? resolve: es una función que nos permite resolver los datos que vamos a utilizar, en este caso obtenemos el usuario que ha creado el post, parent: es el post que estamos resolviendo
        return User.findById(parent.authorId) // ? findById: busca un usuario por id
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent) {
        return Comment.find({ postId: parent.id }) // ? find: busca un comentario por postId
      },
    },
  }),
})

const CommentType = new GraphQLObjectType({
  name: 'CommentType',
  description: 'The comment type',
  fields: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId) // ? findById: busca un usuario por id
      },
    },
    post: {
      type: PostType,
      resolve(parent) {
        return Post.findById(parent.postId) // ? findById: busca un post por id
      },
    },
  },
})

module.exports = {
  UserType,
  PostType,
  CommentType,
}
