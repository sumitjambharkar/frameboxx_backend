const monggose = require('mongoose')

const userSchema = monggose.Schema({
    name:String,
    email:String,
    course:String,
    phone:String,
    message:String
})

module.exports = monggose.model("User",userSchema)