var express = require("express");
var router = express.Router();

const UserContrl = require("../controllers/user-controller");

router.post("/user", UserContrl.createUser);
router.put("/user/:id", UserContrl.updateUser);
router.get("/user/:id", UserContrl.getUserById);
router.get("/user/username/:id", UserContrl.getUserByUsername);
router.get("/users", UserContrl.getUsers);

router.get("/user/feed/:id", UserContrl.getUserFollowingFeed);
router.get("/user/posts/:id", UserContrl.getUserPosts);
router.put("/user/posts/:id", UserContrl.addPost);
router.put("/user/posts/delete/:id", UserContrl.deletePost);
router.put("/user/posts/edit/:id", UserContrl.editPost);

router.put("/user/posts/comments/:id", UserContrl.addComment);
router.put("/user/posts/comments/delete/:id", UserContrl.deleteComment);

router.put("/user/posts/like/:id", UserContrl.likePost);
router.put("/user/posts/unlike/:id", UserContrl.unlikePost);

router.put("/user/settings/:id", UserContrl.updateSettings);
router.get("/user/settings/:id", UserContrl.getUserSettings);

router.put("/user/profilepic/:id", UserContrl.updateProfilePic);
router.get("/user/profilepic/:id", UserContrl.getProfilePic);

router.get("/user/followers/:id", UserContrl.getFollowers);
router.get("/user/following/:id", UserContrl.getFollowing);

router.put("/user/following/:id", UserContrl.updateFollowRelationship);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
