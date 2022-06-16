require ("dotenv").config()
const { PORT = 3001, DATABASE_URL } = process.env
const express = require("express")
const app = express ()
const cors = require("cors")
const morgan = require ("morgan")


const mongoose = require("mongoose")



// if data is json it will auto parse the req.body to json object



mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

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


  
  
app.use(morgan("dev"))
app.use(express.json())

app.use(cors())



  



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