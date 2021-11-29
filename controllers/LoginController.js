var AppUser = require("../models/AppUserModel");
var Writer = require("../models/WriterModel");
var bcrypt = require("bcrypt");

const Register = async (req, res, next) => {
  const { usr, pwd, pwd2 } = req.body;
  await AppUser.findOne({ username: usr }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const errorUsername = "Username has already existed !!!";
      return res.redirect(`/auth/register?msg=${errorUsername}`);
    } else if (pwd.length < 8) {
      const errorPassword = "Password must be at least 8 characters !!!";
      return res.redirect(`/auth/register?msg=${errorPassword}`);
    } else if (pwd2 != pwd) {
      const errorPassword = "Confirm Password Error !!!";
      return res.redirect(`/auth/register?msg=${errorPassword}`);
    } else {
      const newUserAcc = new AppUser({
        username: usr,
        password: pwd,
        role: "writer",
      });
      await newUserAcc.save();
      
      const UserAcc = await AppUser.findOne({ username: usr });
      const newUser = new Writer({
        account_id: UserAcc._id,
      });
      await newUser.save();
      return res.redirect(`/auth/login`);
      // res.send("Successfully !");
    }
  });
};

const SignUp = async (req, res, next) => {
  const user = AppUser({
    username: "admin",
    password: "admin",  
    role: "admin",
  });
  await user.save();
  console.log(user);
  return res.send(user);
};

const Login = (req, res, next) => {
  console.log(req.body);
  const { usr, pwd } = req.body;
  console.log(usr);
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/login");
    } else if (!user) {
      // res.status(401);
      const msg = "User Not Found !!!";
      return res.redirect(`/auth/login?msg=${msg}`);
    } else {
      bcrypt.compare(pwd, user.password, (err, same) => {
        if (same) {
          req.session.userId = user._id;
          req.session.isAdmin = user.role === "admin" ? true : false;
          req.session.isWriter = user.role === "writer" ? true : false;
          req.session.isUserBlock = user.role === "block" ? true : false;

          if (user.role === "admin") {
            return res.redirect(`/admin/home`);
          } else if (user.role === "writer") {
            return res.redirect(`/writers/home`);
          } else if (user.role === "block") {
            const msg = "Your account has been locked !!!";
            return res.redirect(`/auth/login?msg=${msg}`);
          }  
        } else {
          const msg = "Username or Password is incorrect !!!";
          return res.redirect(`/auth/login?msg=${msg}`);
        }
      });
    }
  });
};

const Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
};
const getLogin = async (req, res, next) => {
  const {msg} = req.query;
  try {
   return res.render("login",{
    layout: 'loginLayout.hbs',
    err: msg,
   });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
const getRegister = async (req, res, next) => {
  const {msg} = req.query;
  try {
   return res.render("register",{
    layout: 'loginLayout.hbs',
    err: msg,
   });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
module.exports = {  Login, Logout, SignUp, getLogin, Register, getRegister };