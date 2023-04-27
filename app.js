require("custom-env").env();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expHbs = require("express-handlebars");
const Handlebars = require("handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cookieSession = require("cookie-session");
const mb5 = require("md5");
const flash = require("connect-flash");
const moment = require("moment");
const CronJob = require("cron").CronJob;
const fs = require('fs');


const UserModel = require("./models/users");
const postModel = require("./models/posts");
const savedPosts = require("./models/savedPosts");
const statisticsModel = require("./models/statistics");

console.log(process.env.connection);
mongoose.connect(process.env.connection).then(() => console.log("Connected!"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");

var app = express();

// view engine setup
const hbs = expHbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    flashMe: function (data) {
      if (data.type == "error") {
        let str = `<script>$("#modal-danger").Modal('show');</script>`;
      } else if (data.type == "success") {
        let str = `<script>$("#modal-success").Modal('show');</script>`;
      } else if (data.type == "info") {
        let str = `<script>$("#modal-success").Modal('show');</script>`;
      }
      return new Handlebars.SafeString(str);
    },
    checkMath: function (val1, comparision, val2) {
      switch (comparision) {
        case "==":
          return val1 == val2 ? true : false;
        case "!=":
          return val1 != val2 ? true : false;
        case ">":
          return parseFloat(val1) > parseFloat(val2) ? true : false;
        case "<":
          return val1 < val2 ? true : false;
      }
    },
    Date: function (createdOn, format) {
      var mmt = moment(createdOn);
      return mmt.format(format);
    },
  },
});

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");


   
fs.mkdir(path.join(__dirname, 'public/images'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('initialized images Directory  successfully!');
});
fs.mkdir(path.join(__dirname, 'public/uploads'), (err) => {
  if (err) {
      return console.error(err);
  }
  console.log('initialized uploads Directory  successfully!');
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieSession({
    secret: "session",
    key: "abhH4re5Uf4Rd0KnddSsdf05f3V",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
//using express-session
app.use(
  session({
    secret: "abhH4re5Uf4Rd0KnddSsdf05f3V",
    saveUninitialized: true,
    resave: true,
    maxAge: Date.now() + 30 * 86400 * 1000,
    cookie: { secure: true },
  })
);
app.use(flash());

app.use(cookieParser());

//initializing passport and session
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    //getting user details from db
    function (username, password, done) {
      console.log("username++++++++");
      console.log(username);
      console.log(password);
      UserModel.findOne(
        {
          email: {
            $regex: "^" + username + "$",
            $options: "i",
          },
          password: mb5(password),
        },
        {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          password: 1,
          gender: 1,
          confirmPassword: 1,
          profilePic: 1,

          // checking if details entered are valid or not
        }
      )
        .then(async function (user) {
          if (!user) {
            return done(null, false, {
              message: "enter valid login details",
            });
          } else {
            console.log(user);
            return done(null, user);
          }
        })
        .catch(function (err) {
          console.log(err);
          return done(null, false, {
            message: "please enter valid login details",
          });
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("serializeUser");
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  try {
    console.log("deserialize");
    done(null, user);
  } catch (error) {
    console.log(error);
  }
});

new CronJob(
  "*/60 */30 * * * *",
  async () => {
    const count = await postModel.countDocuments({
      createdOn: {
        $gte: moment().subtract(30, "minute").toDate(),
        $lte: moment().toDate(),
      },
    });
    const countSaved = await savedPosts.countDocuments({
      createdOn: {
        $gte: moment().subtract(30, "minute").toDate(),
        $lte: moment().toDate(),
      },
    });

    const create = await statisticsModel.create({
      totaluploadedPosts: count,
      totalsavedPosts: countSaved,
    });
    console.log(create, countSaved);
  },
  null,
  true
);

//common middleware
app.use(async function (req, res, next) {
  res.locals.aaa = "req.user.firstName";
  let success = req.flash("success");
  let error = req.flash("error");
  if (success.length > 0) {
    res.locals.flash = {
      type: "success",
      message: success,
    };
  }
  if (error.length > 0) {
    res.locals.flash = {
      type: "error",
      message: error,
    };
  }
  if (req.user) {
    // console.log(req.user);
    res.locals.firstName = req.user.firstName;
    res.locals.lastName = req.user.lastName;
    res.locals.email = req.user.email;
    res.locals._id = req.user._id;
    res.locals.profile = req.user.profilePic;
  }
  next();
});

app.use("/", indexRouter);

app.use(function (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
