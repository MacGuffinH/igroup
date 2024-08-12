const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");
const group_controller=require("../controllers/groupController");
const post_controller=require("../controllers/postController");
const { models } = require("mongoose");
const multer=require("multer");
const path=require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')  // 文件存储的目录
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
    // let extname=path.extname(file.originalname);
    // cb(null, Date.now()+extname); // 使用当前时间戳作为文件名
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/homepage")
});
router.get("/login",user_controller.login_get);
router.post("/login",user_controller.login_post);
router.get("/group/create",group_controller.gcreate_get);
router.post("/group/create",group_controller.gcreate_post);
router.get("/group/:id",group_controller.group_detail);
router.get("/group/:id/post/create",post_controller.pcreate_get);
router.post("/group/:id/post/create",upload.single("photo"),post_controller.pcreate_post);
router.get("/post/:id",post_controller.post_detail);
router.post("/post/:id",post_controller.reply_post);
router.get("/group/:id/recentusers",group_controller.ru_detail);
module.exports = router;
