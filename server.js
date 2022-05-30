require ("dotenv").config()
const { PORT = 3001, DATABASE_URL } = process.env
const express = require("express")
const app = express ()
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");

const cors = require("cors")
const morgan = require ("morgan")

const mongoose = require("mongoose")
mongoose.connect(DATABASE_URL)
mongoose.connection
    .on("open", ()=>console.log("MongoDB connected"))
    .on("close",()=> console.log("MongoDB disconnected"))
    .on ("error",()=> console.log(error))

// Menu Schema
const MenuSchema = new mongoose.Schema({
    name: String,
    image: String,
    catagory: String,
    price: Number,
})
const Menu = mongoose.model("Menu", MenuSchema)

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })  
const User = mongoose.model("User", userSchema);
  

// app.use(
//     session({
//         secret: SECRET,
//         store: MongoStore.create({ mongoUrl: DATABASE_URL }),
//         saveUninitialized: true,
//         resave: false,
//     })
//     );

app.use(cors())
app.use (morgan("dev"))
app.use (express.json())

//main route
app.get("/", (req,res)=>{
    res.send ("backend is up")
})

//INDEX GET ROUTE
app.get("/Menu", async (req,res)=>{
    try{res.json(await Menu.find({}))
}catch(error){
    res.status(400).json(error)
    }
})

//CREATE POST ROUTE 
app.post("/Menu",async (req,res)=>{
    try{
        res.json(await Menu.create(req.body))
    }catch (error){
        res.status(400).json(error)
    }
})

// sign up - POST: creates the user in db
app.post("/signup", async (req, res) => {
    // encrypt password first
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    // create the new user in db
    try{
        res.json( await User.create(req.body))      
    }catch(error){
        res.status(400).json(error)
    }
  });
  

//UPDATE PUT ROUTE
app.put("/Menu/:id", async(req,res)=>{
    try{
        res.json(await Menu.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    }catch(error){
        res.status(400).json(error)
    }
})

//DELETE ROUTE 
app.delete("/Menu/:id", async(req,res)=>{
    try{
        res.json(await Menu.findByIdAndDelete(req.params.id))
    }catch(error){
        
    }
})



app.listen(PORT, ()=> console.log (`listening on PORT ${PORT}`))