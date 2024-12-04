const mongoose = require("mongoose")

module.exports = () => {
   mongoose.connect(process.env.URL, {
    dbName: process.env.DBNAME, 
    user: process.env.USERNAME,
    pass:process.env.PASSWORD
   }).then(()=> {
    console.log("DB Connection stablished successfully")
   }).catch((error) => {
      console.log(error)
   })
}