const express = require('express')
const { graphqlHTTP } = require('express-graphql') // ! importamos el modulo de express-graphql, que nos permite crear un servidor de graphql
const schema = require('./graphql/schema') // ! importamos el schema que creamos en graphql/schema.js');
const { connectDB } = require('./db') // ! importamos el modulo de connectDB
const { authenticate } = require('./middlewares/auth')

connectDB() // * conectamos a la base de datos
const app = express()

// * Middlewares de autenticación, para que puedan acceder a las rutas
app.use(authenticate)

app.get('/', (req, res) => {
  res.send('Welcome to the GraphQL API')
})

// * Ruta de graphql, el cual nos permite crear un servidor de graphql
app.use(
  '/graphql',
  graphqlHTTP({
    schema, // ? schema: es el objeto que contiene todas las definiciones de los tipos de datos que vamos a utilizar
    graphiql: true, // ? graphiql: es una herramienta que nos permite visualizar nuestro servidor de graphql
  })
)

app.listen(3000)
console.log('Server is running on port 3000')
