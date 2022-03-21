const { GraphQLString, GraphQLID } = require('graphql')
const { User, Post, Comment } = require('../models')
const { createJWToken } = require('../util/auth')
const { PostType, CommentType } = require('./typedef')

// * Función para crear un nuevo usuario
const register = {
  type: GraphQLString,
  description: 'Register a new user and retorns a token',
  args: {
    // ? args: son los argumentos que recibimos en la mutation
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    diplayName: { type: GraphQLString },
  },
  // ? args: son los argumentos que recibimos en la mutation
  async resolve(_, args) {
    const { username, email, password, diplayName } = args

    // * Primera solucion de guardar un usuario
    // const newUser = await User.create({ username, email, password, diplayName })
    //   console.log(newUser)

    // * Segunda solucion de guardar un usuario
    const user = await new User({ username, email, password, diplayName })
    await user.save()

    // * Retornamos el token, pero sin el campo password
    const token = createJWToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    })

    return token
  },
}

// * Función para loguear un usuario
const login = {
  type: GraphQLString,
  description: 'Login a user and retorns a token',
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const user = await User.findOne({ email: args.email }).select('+password') // ? findOne: busca un usuario por email, select: selecciona los campos que queremos que se muestren en este caso campo oculto password

    if (!user || args.password !== user.password) throw new Error('Invalid credentials')

    // * Retornamos el token, pero sin el campo password
    const token = createJWToken({
      _id: user._id,
      username: user.username,
      email: user.email,
    })
    return token
  },
}

// * Función para crear un nuevo post
const createPost = {
  type: PostType,
  description: 'Create a new post',
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, args, { verifieUser }) {
    // ? verifieUser: es el usuario que está autenticado se obtiene de la request
    if (!verifieUser) throw new Error('Unauthorized')

    const post = new Post({
      title: args.title,
      body: args.body,
      authorId: verifieUser._id,
    })
    await post.save() // ? save: guarda el post en la base de datos

    return post
  },
}

// * Función para actualizar un post
const updatePost = {
  type: PostType,
  description: 'Update a post',
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, { id, title, body }, { verifieUser }) {
    if (!verifieUser) throw new Error('Unauthorized') // ? condicional para verificar si el usuario está autenticado

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, authorId: verifieUser._id }, // ? condicional para verificar si el usuario es el dueño del post
      { title, body }, // ? se actualizan los campos que se le pasan por args
      {
        new: true, // ? new: true: retorna el post actualizado
        runValidators: true, // ? runValidators: true: ejecuta las validaciones, por ejemplo, si el post tiene un campo obligatorio y no se le pasa un valor, se lanzará un error
      }
    )
    return updatedPost
  },
}

// * Función para borrar un post
const deletePost = {
  type: GraphQLString,
  description: 'Delete a post',
  args: {
    postId: { type: GraphQLID },
  },
  async resolve(_, { postId }, { verifieUser }) {
    if (!verifieUser) throw new Error('Unauthorized') // ? condicional para verificar si el usuario está autenticado

    const postDeleted = await Post.findOneAndDelete({
      _id: postId,
      authorId: verifieUser._id, // ? condicional para verificar si el usuario es el dueño del post
    })

    if (!postDeleted) throw new Error('Post not found') // ? condicional para verificar si el post existe

    return 'Post deleted'
  },
}

// * Función para crear un nuevo comentario
const addComment = {
  type: CommentType,
  description: 'Add a comment to a post',
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLID },
  },
  async resolve(_, { comment, postId }, { verifieUser }) {
    const newComment = new Comment({
      comment,
      postId,
      userId: verifieUser._id,
    }) // ? se crea un nuevo comentario
    return await newComment.save() // ? se guarda el comentario en la base de datos
  },
}

// * Función para actualizar un comentario
const updateComment = {
  type: CommentType,
  description: 'Update a comment',
  args: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
  },
  async resolve(_, { id, comment }, { verifieUser }) {
    if (!verifieUser) throw new Error('Unauthorized') // ? condicional para verificar si el usuario está autenticado

    const commentUpdate = await Comment.findOneAndUpdate(
      {
        _id: id, // ? condicional para verificar si el comentario existe
        userId: verifieUser._id, // ? condicional para verificar si el usuario es el dueño del comentario
      },
      {
        comment, // ? se actualiza el comentario
      }
    )

    if (!commentUpdate) throw new Error('Comment not found') // ? condicional para verificar si el comentario existe

    return commentUpdate
  },
}

// * Función para borrar un comentario
const deleteComment = {
  type: GraphQLString,
  description: 'Delete a comment',
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_, { id }, { verifieUser }) {
    if (!verifieUser) throw new Error('Unauthorized') // ? condicional para verificar si el usuario está autenticado

    const commentDelete = await Comment.findByIdAndDelete({
      _id: id, // ? condicional para verificar si el comentario existe
      userId: verifieUser._id, // ? condicional para verificar si el usuario es el dueño del comentario
    })

    if (!commentDelete) throw new Error('Comment not found') // ? condicional para verificar si el comentario existe

    return 'Comment deleted'
  },
}

module.exports = {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
}
