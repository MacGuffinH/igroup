const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  group_name:{type:String,required:true,max:100},
  description:{type:String,max:500},
  recent:{type:Date,required:true},
  fans:{type:[Schema.Types.ObjectId],ref:"User"},
});
GroupSchema.virtual("url").get(function () {
  return "/group/" + this._id;
});
module.exports = mongoose.model("Group", GroupSchema);