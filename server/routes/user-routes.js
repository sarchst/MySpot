var express = require("express");
var router = express.Router();

const UserContrl = require("../controllers/user-controller");

// example from assignment\

// router.post("/message", MovieCtrl.createMessage);
// router.put("/message/:id", MovieCtrl.updateMessage);
// router.delete("/message/:id", MovieCtrl.deleteMessage);
// router.get("/message/:id", MovieCtrl.getMessageById);
// router.get("/messages", MovieCtrl.getMessages);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;