const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");
const group_controller=require("../controllers/groupController");
const post_controller=require("../controllers/postController");
const { models } = require("mongoose");

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
router.post("/group/:id/post/create",post_controller.pcreate_post);
router.get("/post/:id",post_controller.post_detail);
router.post("/post/:id",post_controller.reply_post);
router.get("/group/:id/recentusers",group_controller.ru_detail);
module.exports = router;
