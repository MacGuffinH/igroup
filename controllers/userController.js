const Group= require("../models/group");
const User=require("../models/user");
const Post=require("../models/post");
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
exports.login_get=asyncHandler(async(req,res,next)=>{
    if(req.cookies.loggedIn){
        res.send("你不是已经登录了嘛");
    }else{
    res.render("login",{
        title:"登录",
        username:req.cookies.loggedIn?req.cookies.username:"旅行者"
    });}
})
exports.login_post=asyncHandler(async (req, res,next) => {
    const id=req.body.id;
    const password=req.body.password;
    try {
        // 查找用户
        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 验证密码
        const isMatch = (password==user.password);

        if (!isMatch) {
            return res.status(400).json({ message: '密码错误'});
        }else{
            res.cookie('username',user.name,{maxAge:3600*1000});
            res.cookie('loggedIn','true',{maxAge:3600*1000});
            res.cookie('id',user.id,{maxAge:3600*1000});
            res.redirect("/");
        }

        //创建 JWT token
        // const payload = {
        //     user: {
        //         id: user.id  // 可以根据需要存储更多用户信息
        //     }
        // };

        // jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
        //     if (err) throw err;
            
        //     // 将 token 存储在 Cookie 中
        //     res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 1000 }); // 设置过期时间为 1 小时
            
        //     //res.json({ message: '登录成功' });
        //     res.redirect("/");
        // });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

