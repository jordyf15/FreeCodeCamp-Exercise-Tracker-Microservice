const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema= new Schema({
    userName: {type: String, unique: true},
    log: [{
        description: String,
        duration: Number,
        date: Date
    }]
})
module.exports=mongoose.model('user',userSchema)