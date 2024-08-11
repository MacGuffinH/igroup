const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");
const group_controller=require("../controllers/groupController");
const post_controller=require("../controllers/postController");
const { models } = require("mongoose");
router.get("/", group_controller.index);
module.exports = router;