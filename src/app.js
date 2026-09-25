require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const { connectDB } = require("./config/database");
const { loginValidation } = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require('bcrypt');
const validation = require("validator");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/adminAuth")
const cors = require('cors');
const jwt = require("jsonwebtoken");
const app = express();
const createServer = require("./utils/socket");
const http = require("http");
const server = http.createServer(app);
createServer(server);
require("./utils/cronjob");
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}
));
app.use(express.json());
app.use(cookieParser());

const chatRouter = require('./routers/chat');
const authRouter = require('./routers/auth');
const profileAuth = require('./routers/profile');
const requestAuth = require('./routers/request');
const userAuthh = require('./routers/user');

app.use('/api',authRouter);
app.use('/api',profileAuth);
app.use('/api',requestAuth);
app.use('/api',userAuthh);
app.use('/api',chatRouter);

// // Get user by email

// app.get("/users", async (req, res) => {
//   const email = req.body.emailId;
//   try {
//     console.log(email);
//     const users = await User.findOne({ emailId: email });
//     if (!users) {
//       res.status(400).send("user not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something with wrong with this user not found");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (!users) {
//       res.status(400).send("The database is empty");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something with wrong with this user not found");
//   }
// });
// // delete user from database
// app.delete("/user", async (req, res) => {
//   const email = req.body.emailId;
//   try {
//     const users = await User.deleteOne({ emailId: email });
//     if (!users) {
//       res.status(400).send("There is nothing to be delted");
//     } else {
//       res.send("The user has been deleted", users);
//     }
//   } catch (err) {
//     res.status(400).send("Something with wrong with this user not found");
//   }
// });
// app.patch("/user/:id", async (req, res) => {
//   const userId = req.params.id;
//   const updateFields = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     res.send(updatedUser);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Error updating user");
//   }
// });

//update the user from database
// app.use("/",(req,res,next) =>{
//     //next();
//     // res.send("Hello from the base1");
//     res.send("Hello from the base1");
//     // next();
// },(req,res) =>{
//     res.send("Hello from the inside base 1");
// });

// app.use("/admin",(req,res,next) => {
//     const password = "xyz";
//     const isAuthenicated = password === "xyz";
//     if(!isAuthenicated){
//         res.status(401).send("The user is not authorised");
//     }
//     else{
//         next();
//     }
// });
// app.get("/errorPage",(req,res) => {
//     throw new Error("big data");
//     res.send("some");
// })
// app.use("/admin", adminAuth);

// app.get("/admin/getAdminData",(req,res) => {
//     res.send("All the data has been sent");
// })

// app.get("/user/data",userAuth,(req,res) =>{
//     res.send({firstname:"Shivam", lastName: "Tej"});
// });

// app.use("/",(err,req,res,next) => {
//     if(err)
//     {
//         res.status(500).send("Something went Wrong shivam");
//     }
// })

// app.post("/user",(req,res) =>{
//     res.send("The Data has been sucessfully added to the database");
// });

// app.delete("/user",(req,res) =>{
//     res.send("The data has been deleted from the database");
// });

// app.use("/",(req,res,next) =>{
//     next();
//     res.send("Hello from the base1");
// });
connectDB()
  .then(() => {
    //console.log("Database Connection has been established");
    server.listen(process.env.PORT, () => {
      //console.log("App is listining to the port 3000");
    });
  })
  .catch((err) => {
    //console.log("Error while connecting to the database", err.message);
    throw err;
  });
