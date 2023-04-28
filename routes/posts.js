var express = require("express");
var router = express.Router();
const UserModel = require("../models/users");
const postModel = require("../models/posts");
const savedPostsModel = require("../models/savedPosts");
const multer = require("multer");
const path = require("path");
const savedPosts = require("../models/savedPosts");
const { log, Console } = require("console");
const ObjectId = require("mongoose").Types.ObjectId;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + req.user._id + path.extname(file.originalname));
    //Appending extension
  },
});
const upload = multer({ storage: storage });

/* GET users listing. */

router.post("/create", upload.single("image"), async function (req, res, next) {
  req.body.name = req.body.name.trim();
  req.body.description = req.body.description.trim();
  req.file.filename = req.file.filename.trim();
  req.user._id = req.user._id.trim();
  try {
    const create = await postModel.create({
      postName: req.body.name,
      description: req.body.description,
      postImg: req.file.filename,
      userId: req.user._id,
    });
    res.send({
      type: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      type: "error",
    });
  }
});

router.get("/posts", async function (req, res, next) {
  return res.render("./partials/posts", {
    layout: blank,
    data: data,
  });
});

router.post("/savedPosts", async function (req, res, next) {
  try {
    const existsCheck = await savedPostsModel.exists({
      postId: new ObjectId(req.body.postId),
      savedBy: req.user._id,
    });
    if (existsCheck) {
      const deletingExisting = await savedPostsModel.deleteOne({
        postId: new ObjectId(req.body.postId),
        savedBy: req.user._id,
      });
    } else {
      const savingPosts = await savedPostsModel.create({
        postId: req.body.postId,
        createdBy: req.body.createdBy,
        savedBy: req.user._id,
      });
    }
    res.send({
      type: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      type: "error",
    });
  }
});

router.put(
  "/postsedit",
  upload.single("file"),
  async function (req, res, next) {
    try {
      req.body.name = req.body.name.trim();
      req.body.description = req.body.description.trim();
      req.file.filename = req.file.filename.trim();
      if (req.file) {
        const updatingPost = await postModel.updateOne(
          { _id: req.body.custId },
          {
            postName: req.body.name,
            description: req.body.description,
            postImg: req.file.filename,
          }
        );
      }

      const updatingPostData = await postModel.updateOne(
        { _id: req.body.custId },
        {
          postName: req.body.name,
          description: req.body.description,
        }
      );

      res.send({
        type: "success",
      });
    } catch (error) {
      console.log(error);
      res.send({
        type: "error",
      });
    }
  }
);

router.get("/saved-posts", async function (req, res, next) {
  const data = await postModel.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $lookup: {
        from: "savedPosts",
        localField: "_id",
        foreignField: "postId",
        let: { savedBy: new ObjectId(req.user._id) },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$savedBy", "$$savedBy"],
              },
            },
          },
        ],
        as: "savedposts",
      },
    },
    {
      $unwind: "$savedposts",
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "data",
      },
    },
    {
      $unwind: "$data",
    },
    {
      $project: {
        postName: 1,
        description: 1,
        postImg: 1,
        userId: 1,
        createdOn: 1,
        data: 1,
        savedposts: 1,
      },
    },
  ]);
  return res.render("./timeline", { data: data, layout: "blank" });
});

router.delete("/:postsDelete", async function (req, res, next) {
  try {
    const deletingPost = await postModel.updateOne(
      {
        _id: req.params.postsDelete,
        isDeleted: false,
      },
      {
        isDeleted: true,
      }
    );
    res.send({
      type: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      type: "error",
    });
  }
});

module.exports = router;
