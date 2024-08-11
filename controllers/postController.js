const Group= require("../models/group");
const User=require("../models/user");
const Post=require("../models/post");
const Image=require("../models/image");
const asyncHandler = require("express-async-handler");
const multer=require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')  // 文件存储的目录
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 使用当前时间戳作为文件名
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('只允许上传图片文件!'), false);
    }
    cb(null, true);
  }
});
exports.pcreate_get=asyncHandler(async(req,res,next)=>{
  if(!req.cookies.loggedIn){
    res.redirect("/login");
  }else{
    res.render("pcreate",{
        title:"发帖",
        username:req.cookies.loggedIn?req.cookies.username:"旅行者"
    });}
})
exports.pcreate_post=asyncHandler(async (req, res,next) => {
  // const image = new Image({
  //   name: req.file.originalname,
  //   data: req.file.buffer,
  //   contentType: req.file.mimetype
  // });
  if(!req.cookies.loggedIn){
    res.redirect("/login");
  }else{
  // await image.save();
    //创建新的Post对象
    const author=await User.findOne({id:req.cookies.id}).exec();
    const group=await Group.findById(req.params.id).exec();
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: author,
      createDate: Date(),
      group:group,
      // photo: image // 保存上传文件的文件名
    });

    //将Post对象保存到数据库
    await post.save();
    res.redirect("/group/"+req.params.id);
  }});
exports.post_detail=asyncHandler(async(req,res,next)=>{
  const post=await Post.findById(req.params.id).exec();
  const author=await User.findById(post.author).exec();
  // const image=await Image.findById(post.image).exec();
  // res.setHeader('Content-Type', image.contentType);
  // res.send(image.data);
  res.render("post",{
      name:author.name,
      title:post.title,
      content:post.content,
      reply_list:post.reply,
      username:req.cookies.loggedIn?req.cookies.username:"旅行者"
  });
})
exports.reply_post=asyncHandler(async(req,res,next)=>{
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { reply: req.body.reply} },
  );
  updatedPost.save();
  res.redirect("/post/"+req.params.id);
})