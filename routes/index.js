var express = require("express");
var router = express.Router();
const UserModel = require("../models/users");
const postModel = require("../models/posts");
const mongoose = require("mongoose");
const md5 = require("md5");
const passport = require("passport");
const savedPosts = require("../models/savedPosts");
const statisticsModel = require("../models/statistics");

const ObjectId = require("mongoose").Types.ObjectId;

/* GET home page. */
router.get("/", async function (req, res, next) {
  const data = await postModel.aggregate([
    {
        $match : 
        {
          isDeleted:false
        }
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

router.get("/login", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/timeline");
  }
  res.render("./authenticationProcess/user-login-register", {
    title: "sign-up",
    layout: "login-registration",
  });
});

router.get("/sign-up", function (req, res, next) {
  
  res.render("./authenticationProcess/sign-up", {
    title: "sign-up",
    layout: "login-registration",
  });
});

router.get("/timeline", async function (req, res, next) {
  console.log("isAuhthenticated ===========>", req.isAuthenticated());
  let limit = 15; 
  let page = req.query.page ? req.query.page : 1;
  let skip = (limit * (page - 1 ))
  if (req.isAuthenticated()) {
    const data = await postModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
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
          foreignField: "postId",
          pipeline: [
            { $match: 
              { $expr:
                { $eq: 
                  ["$savedBy", new ObjectId(req.user._id)]
                 } 
                } 
              }
            ],
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
        $sort:{createdOn :-1}
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


    let totalPost = await postModel.countDocuments({isDeleted : false});
    let pageCount = (Math.round(totalPost / limit))+1
    let pageArray = []; 
    for(let i=1; i <= pageCount; i++)
  {
    pageArray.push(i)
  }
    return res.render("./timeline", { data: data, 
      pageArray : pageArray 
    });
  }

  return res.redirect("/dashboard");
});

router.get("/filter", async function (req, res, next) {
    let limit = 6; 
    let page = req.query.page ? req.query.page : 1;
    let skip = (limit * (page - 1 ))
  let obj = {
    isDeleted: false,
  };
  let sortObj = {
    postName : 1
  };
  if(req.query.sort === "title")
  {
     sortObj = {
      postName : -1
    }
  };
  if(req.query.sort === "dateTime")
  {
     sortObj = {
      createdOn : -1
    }
  };

  if (req.query.filter == "mine") {
    obj.userId = new ObjectId(req.user._id);
  } else if (req.query.filter == "others") {
    obj.userId = {
      $ne: new ObjectId(req.user._id),
    };
  } if (req.query.search) { 
    obj = {
      $or: [
        { 
          postName: 
          { 
            $regex: req.query.search, $options: "i" 
          }
           }, 
           { description: 
            { $regex:
              req.query.search, $options: "i" 
            } 
          },
      ],
    };
  }
  const data = await postModel.aggregate([
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
        foreignField: "postId",
        let: { savedBy: new ObjectId(req.user._id) },
        pipeline: [
          { $match: 
            { $expr:
              { $eq: 
                ["$savedBy", "$$savedBy"]
               } 
              } 
            }
          ],
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
      $sort:sortObj
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
        pipeline: [
          { $match: 
            { $expr:
              { $eq: 
                ["$savedBy", "$$savedBy"]
               } 
              } 
            }
          ],
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
      $sort:sortObj
    },
  ]);  

  let totalPost = totalCount.length;
  let pageCount = (Math.round(totalPost / limit))
  let pageArray = []; 
  for(let i=1; i <= pageCount; i++)
{
  pageArray.push(i)
}
  return res.render("./timeline", { data: data, layout: "blank", pageArrays : pageArray });
});

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

router.post("/register-post", async function (req, res, next) {
  try {
    const { firstName, lastName, email, gender, password, confirmPassword } =
      req.body;
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

router.get("/email-validate", async function (req, res, next) {
  try {
    const check = await UserModel.countDocuments({ email: req.query.email });
    const emailCheck = check ? false : true;
    res.send(emailCheck);
  } catch (error) {
  }
});

router.get("/logout", async function (req, res, next) {
  req.logout();
  res.redirect("/dashboard");
});

router.get("/account", async function (req, res, next) {
  return res.render("./partials/account", { layout: "main" });
});

router.get("/post-modal", async function (req, res, next) {
  return res.render("./partials/createPost", { layout: blank });
});

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

router.get("/dashboardSave", function (req, res, next) {
  res.render("./partials/saveError", {
    layout: dashboard,
  });
});

router.get("/report", async function (req, res, next) {
  const data = await statisticsModel.find({
  }).lean()
  res.render("./partials/report", {
    layout: "blank",
    data:data
  });
});


module.exports = router;
    