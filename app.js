/* eslint-disable no-undef */
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
 }

// eslint-disable-next-line no-undef
// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express= require('express');
const app= express();
const ejsMate= require('ejs-mate')
const path= require('path');
const bodyParser = require('body-parser')
const methodOverride= require('method-override');
const campgroundRoutes= require('./routes/campground');
const reviewRoutes= require('./routes/reviews');
const userRoutes= require('./routes/user')
const session= require('express-session');
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local');
const User= require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore= require('connect-mongo');

const mongoose= require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
// eslint-disable-next-line no-undef
app.set('views',path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const sessionOptions = { 
    name: 'blah',
    secret: 'thisShouldBeAGoodSecret',
    resave: false,   
    saveUninitialized: true,
    cookie: {
        http: true,
        //secure: true
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/yelp-camp'
    })
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.query);
    res.locals.currentUser= req.user;
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

  
app.get('/', (req,res)=>{
    res.render('campgrounds/home');
})

app.get('*', (req,res)=>{
    res.send("404!!")
})

app.use((err,req,res)=>{
       const {statusCode= 500} = err;
       if(!err.message) err.message= "Something went wrong";
       res.status(statusCode).render('error', {err});
})

app.listen(3002, ()=>{
    console.log("Serving on port 3000");
})