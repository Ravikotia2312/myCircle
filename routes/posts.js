var express = require("express");
var router = express.Router();
const UserModel = require("../models/users");
const postModel = require("../models/posts");
const notificationsModel = require("../models/notifications");
const savedPostsModel = require("../models/savedPosts");
const multer = require("multer");
const path = require("path");
const savedPosts = require("../models/savedPosts");
const commenstsModel = require("../models/comments");

const { log, Console } = require("console");
const ObjectId = require("mongoose").Types.ObjectId;

// maxSize = 1 * 1000 * 1000;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + req.user._id + path.extname(file.originalname));
    //Appending extension
  },
  onFileUploadStart: function (file, req, res) {
    if (req.files.file.length > maxSize) {
      return false;
    }
  },
});
const upload = multer({
  storage: storage,
  // limits: { fileSize: maxSize }
});
/* GET users listing.*/

//This API creates a post and saves the data inserted by a user to create particular post
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

//This API renders posts partials for each individual posts
router.get("/posts", async function (req, res, next) {
  return res.render("./partials/posts", {
    layout: blank,
    data: data,
  });
});

//This API saves the posts and creates a notification for a user by whom the post was created to let them acknowledge about a save of post
router.post("/savedPosts", async function (req, res, next) {
  try {
   
    console.log(req.body.createdBy);
    const existsCheck = await savedPostsModel.exists({
      postId: new ObjectId(req.body.postId),
      savedBy: req.user._id,
    });
    if (existsCheck) {
      const deletingExisting = await savedPostsModel.deleteOne({
        postId: new ObjectId(req.body.postId),
        savedBy: req.user._id,
      });

      const savedPostCount = await savedPosts.countDocuments({
        postId: new ObjectId(req.body.postId),
      });
      console.log(savedPostCount);

      res.send({
        type: "success",
        data: savedPostCount,
      });
    } else {
      const savingPosts = await savedPostsModel.create({
        postId: req.body.postId,
        createdBy: req.body.createdBy,
        savedBy: req.user._id,
      });

      const savedPostCount = await savedPosts.countDocuments({
        postId: new ObjectId(req.body.postId),
      });
      console.log(savedPostCount);

      const notifications = await notificationsModel.create({
        postId: req.body.postId,
        createdBy: req.body.createdBy,
        savedBy: req.user._id,
        savedByName: `${req.user.firstName}_${req.user.lastName}`,
      });

        console.log(notifications)
     
      const notificationsCount = await notificationsModel.countDocuments({
        isDeleted: false,
        isSeen: false,
        createdBy: new ObjectId(req.body.createdBy),
      });

      const notificationBy = await notificationsModel.find({
        isDeleted: false,
        isSeen: false,
        savedBy: new ObjectId(req.user._id),
      }).sort({'_id':-1}).limit(1);
     

      const savedPost = notificationBy[0].postId

      const image  = await postModel.findOne({_id : savedPost })

      console.log(notificationBy, "notificationBy");
      io.to(req.body.createdBy).emit("postSave", {
        name: req.user.firstName,
        notificationsCount: notificationsCount,
        notificationBy : notificationBy,
        image : image.postImg,
        id : image._id

      }); //emitting post save event from here

      return res.send({
        type: "successSave",
        data: savedPostCount,
        notificationsCount: notificationsCount,
      });
    }

  } catch (error) {
    console.log(error);
    res.send({
      type: "error",
    });
  }
});

//This API allows users to edit a post created by him/her
router.put(
  "/postsedit",
  upload.single("file"),
  async function (req, res, next) {
    try {
      req.body.name = req.body.name.trim();
      req.body.description = req.body.description.trim();
      if (req.file) {
        req.file.filename = req.file.filename.trim();
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

//This API filters out those posts which is saved by logged in user.
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

//This API is for archieving posts and to update isDeleted status from isDeleted false to isDeleted true
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

//posts/123/saved-by 
/**This  API gets the user list by whom that particular post is being saved*/
router.get("/:postId/saved-by", async function (req, res, next) {
  try {
    console.log(req.params.postId);

    const data = await savedPostsModel.aggregate([
      {
        $match: { postId: new ObjectId(req.params.postId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "savedBy",
          foreignField: "_id",

          as: "userdata",
        },
      },
      {
        $unwind: "$userdata",
      },
      {
        $project: {
          userdata: 1,
        },
      },
    ]);

    res.render("partials/info", { userdata: data, layout: "blank" });
  } catch (err) {
    console.log(err);
  }
});

//This helps user to zoom out post image for better view
router.get("/:postId/image-zoom-out", async function (req, res, next) {
  try {
    console.log(req.params.postId, "req.params.postId");
    const imageSearch = await postModel.findOne({
      _id: new ObjectId(req.params.postId),
    });
    const path = imageSearch.postImg;
    res.render("partials/imagePop", { path: path, layout: "blank" });
    // res.send({type : "success"})
  } catch (err) {
    console.log(err);
  }
});

//This API posts a comment on a post  
router.post("/:postId/create-comment", async function (req, res, next) {
  try {
    console.log(req.params.postId);
    console.log(req.body.comment);
    console.log(req.user._id);

    const creatingComment = await commenstsModel.create({
      commentOn: req.params.postId,
      commentBy: req.user._id,
      comment: req.body.comment,
    });

    console.log(creatingComment);

    res.send({ type: "success" });
  } catch (err) {
    console.log(err);
  }
});

//if there are previous comments on a post, this API will make them list below create comment section
router.get("/comments-data", async function (req, res, next) {
  try {
  
    const commentData = await postModel.aggregate([
      {
        $match: {
          isDeleted: false,
          _id: new ObjectId(req.query.postId),
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "commentOn",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "commentBy",
                foreignField: "_id",
                as: "userdata",
              },
            },
            {
              $unwind: { path: "$userdata", preserveNullAndEmptyArrays: true },
            },
          ],
          as: "data",
        },
      },
      {
        $unwind: "$data",
      },
      {
        $project: {
          data: 1,
        },
      },
    ]);

    res.render("partials/commentsList", {
      commentData: commentData,
      layout: "blank",
    });
  } catch (err) {
    console.log(err);
  }
});

//this API updates notification panel when user clicks on a notification
router.post("/:notificationId/notification-panel-update", async function (req, res, next) {

try {
  console.log(req.params);
  const updatingNotificationPanel = await notificationsModel.updateOne({_id: new ObjectId(req.params.notificationId),isSeen:false, isDeleted:false},{isSeen:true})
  console.log(updatingNotificationPanel);

  const notificationsDecreasingCount = await notificationsModel.countDocuments({ createdBy: new ObjectId(req.user._id), isSeen:false, isDeleted:false})

 
  io.to(req.user._id).emit("notificationSeen", notificationsDecreasingCount); 
  console.log(io.to(req.user._id).emit("notificationSeen", notificationsDecreasingCount));

  return res.send({type : "success"})
} catch (error) {
  console.log(error);
  
}
})

//this API allows user to access the post which was saved and indicated in notification panel
router.post("/:postId/notification-posts-access", async function (req, res, next) {

try {

  const post = await postModel.findOne({_id : new ObjectId(req.params.postId) })

  console.log("post =========>",post);
  
  // res.render("notificationPostModal", {
  //   post: post,
  //   layout: "blank",
  // });

  res.send({
    type : "success",
    data : post
  })

} catch (error) {
  console.log(error);
}
  
})


module.exports = router;
