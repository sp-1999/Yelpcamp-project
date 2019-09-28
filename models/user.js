var mongoose=require('mongoose');
var passportLocalMangoose=require('passport-local-mongoose');
var UserSchema=mongoose.Schema({
    username:String,
    password:String
});
UserSchema.plugin(passportLocalMangoose);
module.exports=mongoose.model('User',UserSchema);