const Group= require("../models/group");
const User=require("../models/user");
const Post=require("../models/post");
const Image=require("../models/image");
const asyncHandler = require("express-async-handler");
const fs=require("fs");

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
  if(!req.cookies.loggedIn){
    res.redirect("/login");
  }else{
    if(req.file){
    const image = new Image({
      name: req.file.originalname,
      // data: req.file.buffer,
      data: (fs.readFileSync("public/uploads/"+req.file.originalname)).toString('base64'),
      contentType: req.file.mimetype
    });
    await image.save();
    //创建新的Post对象
    const author=await User.findOne({id:req.cookies.id}).exec();
    const group=await Group.findById(req.params.id).exec();
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: author,
      createDate: Date(),
      group:group,
      photo: image // 保存上传文件的文件名
    });

    //将Post对象保存到数据库
    await post.save();
    res.redirect("/group/"+req.params.id);
    }else{
      const author=await User.findOne({id:req.cookies.id}).exec();
      const group=await Group.findById(req.params.id).exec();
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: author,
        createDate: Date(),
        group:group,
      });
  
      //将Post对象保存到数据库
      await post.save();
      res.redirect("/group/"+req.params.id);
    }
  }});
exports.post_detail=asyncHandler(async(req,res,next)=>{
  const post=await Post.findById(req.params.id).exec();
  const author=await User.findById(post.author).exec();
  const image=await Image.findById(post.photo).exec();
  if(post.photo!=null){
    const base64=image.data;
    res.render("post",{
      image:image,
      base64:base64,
      name:author.name,
      title:post.title,
      content:post.content,
      reply_list:post.reply,
      username:req.cookies.loggedIn?req.cookies.username:"旅行者"
    })
  }else{res.render("post",{
      name:author.name,
      title:post.title,
      content:post.content,
      reply_list:post.reply,
      username:req.cookies.loggedIn?req.cookies.username:"旅行者"
  });}
})
exports.reply_post=asyncHandler(async(req,res,next)=>{
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { reply: req.body.reply} },
  );
  updatedPost.save();
  res.redirect("/post/"+req.params.id);
})