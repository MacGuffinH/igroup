const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{type:String,max:50},
  id:{type:Number,required:true},
  password:{type:String,required:true},
  JoinGroups:{type:[Schema.Types.ObjectId],ref:"Group"}
});
module.exports = mongoose.model("User",UserSchema);