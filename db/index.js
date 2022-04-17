const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect('mongodb://localhost/blogdb', {})
  console.log('MonogoDB Connected', mongoose.connection.db.databaseName)
}

module.exports = { connectDB }
