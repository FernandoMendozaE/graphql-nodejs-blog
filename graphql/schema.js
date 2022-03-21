const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const { users, user, posts, post, comments, comment } = require('./queries') // ! Importamos nuestras queries
const {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
} = require('./mutations') // ! Importamos nuestras mutations

// * GraphQLObjectType: es una clase que nos permite crear un tipo de dato, fields: es un objeto que contiene todas las definiciones de los campos que vamos a utilizar, resolve: es una función que nos permite resolver los datos que vamos a utilizar
const QueryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'This is the root query type',
  fields: {
    users,
    user,
    posts,
    post,
    comments,
    comment,
  },
})

const MutationType = new GraphQLObjectType({
  name: 'MutationType',
  description: 'This is the root mutation type',
  fields: {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
  },
})

// * GraphQL schema: es el objeto que contiene todas las definiciones de los tipos de datos que vamos a utilizar
module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
