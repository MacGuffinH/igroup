const mongoose = require("mongoose");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const crypto = require('crypto');
const { type } = require("os");

// // 创建存储引擎
// const storage = new GridFsStorage({
//     url: 'mongodb://localhost:27017',
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + '-' + file.originalname;
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'photos' // 与GridFS集合名称相同
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
//   const upload = multer({ storage });

const Schema = mongoose.Schema

const PostSchema= new Schema({
    title:{type:String,min:1,max:20,required:true},
    author:{type:Schema.Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true,max:500},
    reply:{type:[String]},
    group:{type:Schema.Types.ObjectId,ref:"Group"},
    createDate:{type:Date,required:true},
    photo:{type: Schema.Types.ObjectId,ref:"Image"},

})
PostSchema.virtual("url").get(function () {
    return "/post/" + this._id;
  });
module.exports = mongoose.model("Post",PostSchema);
// const Post = mongoose.model('Post', PostSchema);

// // 导出模型和上传对象
// module.exports = { Post, upload };

