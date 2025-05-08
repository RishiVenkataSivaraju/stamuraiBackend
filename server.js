const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const initializePassport = require("./config/passportConfig");

dotenv.config();  // Load environment variables

const app = express();

// ✅ Apply globally before any routes
const allowedOrigins = [
  'https://stamurai-frontend-gray.vercel.app',
  'https://stamurai-frontend-gray.vercel.app/login',
  'https://stamurai-frontend-gray.vercel.app/register',
  'https://stamurai-frontend-gray.vercel.app/dashboard',
  'https://stamurai-backend.vercel.app/auth/login',
  'https://stamurai-backend.vercel.app/auth/register',
  'https://stamurai-backend.vercel.app/me',
  'https://stamurai-backend.vercel.app/users',
  'https://stamurai-backend.vercel.app/tasks',
  'https://stamurai-backend.vercel.app/tasks/search',
  'https://stamurai-backend.vercel.app/notifications/unread',
  'https://stamurai-backend.vercel.app/notifications/:id/read',
  'https://stamurai-backend.vercel.app/tasks/:id',
];
app.use(cors());
app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin',allowedOrigins);
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Methods','POST');
  //headers clients can use in their requests
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  //allow request to continue and be handled by routes
  next();
});


// 1. MongoDB Connection
mongoose.connect("mongodb+srv://sivarajurishi:57BDRZdE0kvk7rAT@assignment.kuwqzsp.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("🗄️  Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);  // Exit process on connection failure
    });

// 2. Middlewares
app.use(express.json());  // To parse JSON bodies
app.use(session({
    secret: "testsecret",
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport.js for authentication
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// 3. Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const taskRoutes = require("./routes/tasks");
app.use("/tasks", taskRoutes);

const notifications = require("./routes/notifications");
app.use("/notifications", notifications);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);



const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// Test Route (optional, can be removed later)
app.get("/", (req, res) => {
    res.send("Hello from Express backend");
});


app.get('/me', isAuthenticated, (req, res) => {
    res.json(req.user);
    console.log(req.user)// req.user is set by Passport after login
});

const PORT = process.env.PORT || 8080;

app.get("/tasks", (req, res) => {
    res.send("TASKS NEED TO BE DONE")
})
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

