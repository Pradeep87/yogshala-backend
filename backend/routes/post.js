const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middelwares/auth");
const {
  doPost,
  getUserPost,
  doLike,
  doComment,
  getTimelinePost,getCommentByPost,deleteCommentOrReplyById,
  getPostById,
} = require("../controllers/post");

router.route("/").post(isAuthenticatedUser, doPost);
router.route("/").get(isAuthenticatedUser, getUserPost);
router.route("/like").post(isAuthenticatedUser, doLike);
router.route("/comment").post(isAuthenticatedUser, doComment);
router.route("/comment/:id").get(isAuthenticatedUser, getCommentByPost);
router.route("/comment/:id").delete(isAuthenticatedUser, deleteCommentOrReplyById);

router.route("/timeline").get(isAuthenticatedUser, getTimelinePost);
router.route("/:id").get(isAuthenticatedUser, getPostById);

module.exports = router;
