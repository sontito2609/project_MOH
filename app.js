var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
var paginate = require('handlebars-paginate');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var methodOverride = require("method-override");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');

var { isWriter } = require("./middleware/requiresLogin");
var { isAdmin } = require("./middleware/requiresLogin");

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var adminRouter = require("./routes/admin");
var writerRouter = require("./routes/writer");

var app = express();
var mongoose = require("mongoose");

// connect to Database
const uri = "mongodb+srv://hoangson:sontito2609@cluster0.2zp2e.mongodb.net/MOH?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to DB ...."))
  .catch((err) => console.log(`Connect to Db failed. Error: ${err}`));

// using Session to verify User Login.
app.use(
  session({
    secret: "mySecretSession",
    resave: true,
    saveUninitialized: false,
  })
);
Handlebars.registerHelper('equals', function (a, b, options) {
  if (a == b) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
});
Handlebars.registerHelper('paginate', paginate);
app.engine(
  'hbs',
  exphbs({
      defaultLayout: 'layout',
      layoutsDir: path.join(__dirname, 'views/layouts'),
      partialsDir: path.join(__dirname, 'views/partials'),
      handlebars: allowInsecurePrototypeAccess(Handlebars),
      extname: '.hbs',
      helpers: require('handlebars-helpers')(),
  }),
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.post('/upload',multipartMiddleware,(req,res)=>{
  try {
      fs.readFile(req.files.upload.path, function (err, data) {
          var newPath = __dirname + '/public/user/images/' + req.files.upload.name;
          fs.writeFile(newPath, data, function (err) {
              if (err) console.log({err: err});
              else {
                  console.log(req.files.upload.originalFilename);
               
                  let fileName = req.files.upload.name;
                  let url = '/user/images/'+fileName;                    
                  let msg = 'Upload successfully';
                  let funcNum = req.query.CKEditorFuncNum;
                  console.log({url,msg,funcNum});
                 
                  res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
              }
          });
      });
     } catch (error) {
         console.log(error.message);
     }
})
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", isAdmin, adminRouter);
app.use("/writers", isWriter, writerRouter);
 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
