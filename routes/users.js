var express = require("express");
var router = express.Router();
const UserModel = require("../models/users");
const postModel = require("../models/posts");
const multer = require("multer");
const path = require("path");
const { log } = require("console");
const CronJob = require("cron").CronJob;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + path.extname(file.originalname));
    //Appending extension
    console.log(req.user._id + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/* GET users listing. */

router.put("/edit", upload.single("file"), async function (req, res, next) {
  //editing user from the account section of profile
  console.log("hitted ");
  try {
    console.log(req.file);
    const file = req.file;
    console.log(file);
    if (file) {
      const profile = file.filename;
      if (profile) {
        await UserModel.updateOne(
          {
            _id: req.user._id,
          },
          { profilePic: profile }
        );
        req.user.profilePic = profile;
      }
    }

    console.log(req.body);

    const { firstName, lastName, email } = req.body;

    const edit = await UserModel.updateOne(
      {
        _id: req.user._id,
      },
      { firstName, lastName, email }
    );
    req.user.firstName = req.body.firstName;
    req.user.email = req.body.email;
    req.user.lastName = req.body.lastName;
    console.log(req.user, edit);
  } catch (error) {
    console.log(error);
  }

  res.send({
    type: "success",
  });
});

router.get("/userslist", async function (req, res, next) {
  //editing user from the account section of profile
  console.log("hitted  userslist");
  console.log(req.query.search);
  try {
    let limit = 4; 
    let page = req.query.page ? req.query.page : 1;
    console.log(page);
    let skip = (limit * (page - 1 ))
    console.log(skip);


    let obj = {
      isDeleted: false,
    };
    let sortingOrder = 1;

    if (req.query.sort == "sortbyRegistration") {
      sortingOrder = -1;
    }


    if (req.query.search) {
      obj = {
        $or: [
          {
            firstName: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }
    const usersData = await UserModel.aggregate([
      {
        $match: obj,
      },
      {
        $skip : skip
      },
      {
        $limit : limit
      },
      {
        $lookup: {
          from: "savedPosts",
          localField: "_id",
          foreignField: "savedBy",
          let: { isDeleted: false },
          pipeline: [
            { $match: { $expr: { $eq: ["$isDeleted", "$$isDeleted"] } } },
          ],
          as: "saved",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          let: { isDeleted: false },
          pipeline: [
            { $match: { $expr: { $eq: ["$isDeleted", "$$isDeleted"] } } },
          ],
          as: "data",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          gender: 1,
          createdOn: 1,
          profilePic: 1,
          fullName: {$concat: ["$firstName"," ","$lastName"]},
          totalsavedPosts: { $size: "$saved" },
          totaluploadedPosts: { $size: "$data" },

        },
      },
      {
        $sort: { createdOn: sortingOrder },
      },
    ]);
    

    const usersCount = await UserModel.aggregate([
      {
        $match: obj,
      },
      {
        $lookup: {
          from: "savedPosts",
          localField: "_id",
          foreignField: "savedBy",
          let: { isDeleted: false },
          pipeline: [
            { $match: { $expr: { $eq: ["$isDeleted", "$$isDeleted"] } } },
          ],
          as: "saved",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          let: { isDeleted: false },
          pipeline: [
            { $match: { $expr: { $eq: ["$isDeleted", "$$isDeleted"] } } },
          ],
          as: "data",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          gender: 1,
          createdOn: 1,
          profilePic: 1,
          fullName: {$concat: ["$firstName"," ","$lastName"]},
          totalsavedPosts: { $size: "$saved" },
          totaluploadedPosts: { $size: "$data" },

        },
      },
      {
        $sort: { createdOn: sortingOrder },
      },
    ]);

    let totalPost = usersCount.length;
    console.log(totalPost);
    let pageCount = (Math.round(totalPost / limit))
    console.log(pageCount);
    let pageArray = []; 
  for(let i=1; i <= pageCount; i++)
{
  pageArray.push(i)
}
    // console.log(usersData);
    res.render("./partials/usersList", {
      layout: "blank",
      usersData: usersData,
      pageArray:pageArray

    });
  } catch (error) {
    console.log(error);
  }

  // res.send({type:"success"});
});

module.exports = router;
