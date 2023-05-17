var express = require("express");
var router = express.Router();
const UserModel = require("../models/users");
const postModel = require("../models/posts");
const mongoose = require("mongoose");
const md5 = require("md5");
const passport = require("passport");
const savedPosts = require("../models/savedPosts");
const statisticsModel = require("../models/statistics");
const notificationsModel = require("../models/notifications");
const moment = require("moment");
var nodemailer = require("nodemailer");
const users = require("../models/users");
const messagesModel  = require("../models/messages");
const { log } = require("handlebars/runtime");
const ObjectId = require("mongoose").Types.ObjectId;

/* GET home page. */
//dashboard route, where users are not allowed to save posts as to do so, user need to login first
router.get("/", async function (req, res, next) {
  const data = await postModel.aggregate([
    {
      $match: {
        isDeleted: false,
      },
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
        createdOn: 1,
        data: 1,
      },
    },
  ]);

  res.render("dashboard", {
    title: "dashboard",
    layout: "dashboard",
    data: data,
  });
});

//route to render login page and if user is already logged in, he/she will be redirected to timeline
router.get("/login", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/timeline");
  }
  res.render("./authenticationProcess/user-login-register", {
    title: "sign-up",
    layout: "login-registration",
  });
});

//API to render registration page
router.get("/sign-up", function (req, res, next) {
  res.render("./authenticationProcess/sign-up", {
    title: "sign-up",
    layout: "login-registration",
  });
});

//this API renders the landing page of application which is timeline, with all data
router.get("/timeline", async function (req, res, next) {
  console.log("isAuhthenticated ===========>", req.isAuthenticated());
  let limit = 15;
  let page = req.query.page ? req.query.page : 1;
  let skip = limit * (page - 1);
  if (req.isAuthenticated()) {
    const data = await postModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "savedPosts",
          localField: "_id",
          foreignField: "postId",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$savedBy", new ObjectId(req.user._id)] },
              },
            },
          ],
          as: "savedposts",
        },
      },
      {
        $lookup: {
          from: "savedPosts",
          localField: "_id",
          foreignField: "postId",

          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "savedBy",
                foreignField: "_id",
                as: "usersData",
              },
            },
            {
              $group: {
                _id: "$savedBy",
                name: {
                  $push: "$usersData.firstName",
                },
                lastname: {
                  $push: "$usersData.lastName",
                },
              },
            },
            {
              $unwind: "$name",
            },
          ],
          as: "postSaved",
        },
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
        $sort: { createdOn: -1 },
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
          postId: 1,
          postSaved: 1,
          count: {
            $size: {
              $ifNull: ["$postSaved", []],
            },
          },
        },
      },
    ]);

    const total = await postModel.countDocuments({ isDeleted: false });
    const notificationsCount = await notificationsModel.countDocuments({
      isDeleted: false,
      isSeen: false,
      createdBy: req.user._id,
    });

    const notificationDetails = await notificationsModel.aggregate([
      {
        $match: {
          createdBy: new ObjectId(req.user._id),
          isSeen: false,
          isDeleted: false,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "savedBy",
          as: "notificationDetailUser",
        },
      },
      {
        $lookup: {
          from: "posts",
          foreignField: "_id",
          localField: "postId",
          as: "Post",
        },
      },
      {
        $unwind: "$notificationDetailUser",
      },
      {
        $unwind: "$Post",
      },
      {
        $project: {
          savedByName: 1,
          "notificationDetailUser.firstName": 1,
          "Post.postImg": 1,
          "Post._id": 1,
        },
      },
    ]);

    console.log(notificationDetails, "notificationDetails");

    let totalPost = await postModel.countDocuments({ isDeleted: false });
    let pageCount = Math.round(totalPost / limit) + 1;
    let pageArray = [];
    for (let i = 1; i <= pageCount; i++) {
      pageArray.push(i);
    }

    return res.render("timeline", {
      data: data,
      pageArray: pageArray,
      total: total,
      local: res.locals._id,
      notificationsCount: notificationsCount,
      notificationDetails: notificationDetails,
    });
  }

  return res.redirect("/dashboard");
});

//this API controls filter according to the query it gets.
router.get("/filter", async function (req, res, next) {
  let limit = 6;
  let page = req.query.page ? req.query.page : 1;
  let skip = limit * (page - 1);
  let obj = {
    isDeleted: false,
  };
  let sortObj = {
    postName: 1,
  };
  if (req.query.sort === "title") {
    sortObj = {
      postName: -1,
    };
  }
  if (req.query.sort === "dateTime") {
    sortObj = {
      createdOn: -1,
    };
  }
  if (req.query.filter == "mine") {
    obj.userId = new ObjectId(req.user._id);
  } else if (req.query.filter == "others") {
    obj.userId = {
      $ne: new ObjectId(req.user._id),
    };
  }
  if (req.query.search) {
    obj = {
      $or: [
        {
          postName: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        { description: { $regex: req.query.search, $options: "i" } },
      ],
    };
  }
  const data = await postModel.aggregate([
    {
      $match: obj,
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "savedPosts",
        localField: "_id",
        foreignField: "postId",
        let: { savedBy: new ObjectId(req.user._id) },
        pipeline: [{ $match: { $expr: { $eq: ["$savedBy", "$$savedBy"] } } }],
        as: "savedposts",
      },
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
    {
      $sort: sortObj,
    },
  ]);
  const totalCount = await postModel.aggregate([
    {
      $match: obj,
    },
    {
      $lookup: {
        from: "savedPosts",
        localField: "_id",
        foreignField: "postId",
        let: { savedBy: new ObjectId(req.user._id) },
        pipeline: [{ $match: { $expr: { $eq: ["$savedBy", "$$savedBy"] } } }],
        as: "savedposts",
      },
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
    {
      $sort: sortObj,
    },
  ]);

  let totalPost = totalCount.length;
  let pageCount = Math.round(totalPost / limit);
  let pageArray = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArray.push(i);
  }
  return res.render("./timeline", {
    data: data,
    layout: "blank",
    pageArrays: pageArray,
  });
});

//this API checks credentials entered by the user to make them authenticated, using passport authentication
router.post("/login", async function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "please provide valid login details");
      return res.redirect("/login");
    }

    req.login(user, function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.redirect("/timeline");
    });
  })(req, res, next);
});

// this API helps a user to get themselves registered on the application.
router.post("/register-post", async function (req, res, next) {
  try {
    const { firstName, lastName, email, gender, password, confirmPassword } =
      req.body;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mycircle10001@gmail.com",
        pass: "rhpsngylpltgqwxc",
      },
    });

    var mailOptions = {
      from: "mycircle10001@gmail.com",
      to: email,
      subject: `Welcome!!!`,
      text: "Welcome to Mycircle",
      html: `<a href="/localhost">Verify Email.</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    if (password == confirmPassword) {
      await UserModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        password: md5(password),
        confirmPassword: md5(confirmPassword),
      });
      return res.send({
        type: "success",
      });
    }
    return res.send({
      type: "unmatchedPasswords",
    });
  } catch (error) {
    res.send({
      type: "error",
    });
  }
});

//this states to user that if the email he/she is entering is available or not if email is already taken then user need to use any another and unique
router.get("/email-validate", async function (req, res, next) {
  try {
    const check = await UserModel.countDocuments({ email: req.query.email });
    const emailCheck = check ? false : true;
    res.send(emailCheck);
  } catch (error) {
    console.log(error);
  }
});

//this API logouts a already signed in user.
router.get("/logout", async function (req, res, next) {
  req.logout();
  res.redirect("/dashboard");
});

//render the account page of application, which contains logged in user details
router.get("/account", async function (req, res, next) {
  return res.render("./partials/account", { layout: "main" });
});

//this API renders a edit post modal
router.get("/editpost", async function (req, res, next) {
  console.log(req.query.value);
  const getPost = await postModel.findOne({
    _id: new mongoose.Types.ObjectId(req.query.value),
  });

  res.send({
    name: getPost.postName,
    description: getPost.description,
    image: getPost.postImg,
    id: getPost._id,
  });
});

//this API renders the posts which we need to show on the dashboard side of application
router.get("/dashboardSave", function (req, res, next) {
  res.render("./partials/saveError", {
    layout: dashboard,
  });
});

//this API generates data for the report of application
router.get("/report", async function (req, res, next) {
  try {
    const statistics = await statisticsModel.find({});
    let array = [];
    let dataArray = [];
    let savedArray = [];
    for (let value of statistics) {
      savedArray.push(value.totalsavedPosts);
      dataArray.push(moment(value.createdOn).format("YYYY_MM_DD_hh_mm"));
      array.push(value.totaluploadedPosts);
    }
    res.render("./partials/report", {
      layout: "blank",
      data: array,
      dates: dataArray,
      saved: savedArray,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/chats", async function (req, res, next) {
  console.log("reached================>");

  const users = await UserModel.find({ 
    isDeleted: false,
    _id : {$ne : req.user._id}
  }).lean(); 

  res.render("./partials/chatModal", {
    layout: "blank",
    chatUsers: users,
  });
});

router.get("/chats-current-user", async function (req, res, next) {
  console.log("reached================>");
  console.log(req.query.userId);

  const chatCurrentUser = await UserModel.findOne({ isDeleted: false,_id:req.query.userId }).lean(); 
  console.log(chatCurrentUser);

    const chatCurrentUserData = await messagesModel.aggregate([
{
  $match : {
    $or : [
          {$and : [{ sentTo:new ObjectId(req.query.userId)},{createdBy:new ObjectId(req.user._id)}] },
          {$and : [{ sentTo:new ObjectId(req.user._id)},{createdBy:new ObjectId(req.query.userId)}] }        
          ]
  }
},
{
  $sort : {_id : 1}
}
])

  res.send({
    type: "success",
    chatCurrentUser: chatCurrentUser,
    chatCurrentUserData : chatCurrentUserData,
    loginUser : req.user._id
  });
});

router.post("/conversation", async function (req, res, next) {
  console.log("reached================>");
  const{currentChatTo, message} = req.body

 const storingMessage = await messagesModel.create({
  createdBy : new ObjectId(req.user._id),
  sentTo : new ObjectId(currentChatTo),
  message : message
 })

 io.to(currentChatTo).emit("message",{message, name : req.user.firstName,} ); 
  console.log(storingMessage);

  res.send({
    type : "success",
    data : message })  
});

module.exports = router;
