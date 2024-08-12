const Group= require("../models/group");
const User=require("../models/user");
const Post=require("../models/post");
const { ObjectId } = require('mongodb');
const asyncHandler = require("express-async-handler");
function uniquePreserveOrder(array) {
    const seen = new Set();
    const uniqueArray = [];
    
    for (const item of array) {
        if (!seen.has(item)) {
            uniqueArray.push(item);
            seen.add(item);
        }
    }
    
    return uniqueArray;
}
exports.index=asyncHandler(async(req,res,next)=>{
    const allgroups=await Group.find({},"group_name description").exec();
    //await User.deleteMany({});
    // await Post.deleteMany({});
    const user=new User({id:2,name:"测试人2",password:"2"});
    await user.save();
    let username;
    const loggedIn = req.cookies.loggedIn === 'true';
    if (loggedIn) {
       username=req.cookies.username;
    } else {
        username="旅行者";
    }
    res.render("homepage",{title:"兴趣圈一览,",group_list:allgroups,username:username});
    
});
exports.group_detail=asyncHandler(async(req,res,next)=>{
    // const [group,posts]=await Promise.all([
    //     Group.findById(req.params.id).exec(),
    //     Post.find({Group: req.params.id}).exec(),
    // ])
    const group=await Group.findById(req.params.id).exec();
    const posts=await Post.find({group:req.params.id}).sort({createDate:-1}).exec();
    res.render("group",{
        group_url:group.url,
        title:group.group_name,
        description:group.description,
        allposts:posts,
        username:req.cookies.loggedIn?req.cookies.username:"旅行者"
    });
});
exports.gcreate_get=asyncHandler(async(req,res,next)=>{
    res.render("gcreate",{
        title:"来创建兴趣圈吧",
        username:req.cookies.loggedIn?req.cookies.username:"旅行者"
    });
})
exports.gcreate_post=asyncHandler(async (req, res, next) => {  
    const group = new Group({ group_name: req.body.name ,description: req.body.description,recent:Date()});
    await group.save();
    res.redirect("/homepage");
});
exports.ru_detail=asyncHandler(async(req,res,next)=>{
    const Posts=await Post.find({group:req.params.id}).sort({createDate:-1}).exec();
    ids=Posts.map(Post=>Post.author);
    activers=await User.find({ _id: { $in: ids } })
    .then(users => {
        // 创建一个ID到用户对象的映射
        const userMap = new Map(users.map(user => [user._id.toString(), user]));

        // 按照原始ids数组的顺序返回用户对象
        const activers = ids.map(id => userMap.get(new ObjectId(id).toString()));
        return activers;

        });
        activers=uniquePreserveOrder(activers);
    res.render("activer",{
        activer_list:activers,
         username:req.cookies.loggedIn?req.cookies.username:"旅行者"
    })
})