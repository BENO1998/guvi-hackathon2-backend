const express = require("express")

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : false}))

const cors = require("cors")
app.use(cors())

const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://beno:beno123@cluster0.lci7auh.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology : true,
}).then(()=>{
    console.log("Connection Successfull")
}).catch((err)=>{
    console.log(err)
})

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : {
        type: String,
        required :true,
        unique : true,
    },
    password : String,
    confirmpassword : String
    
})
const UserModel = new mongoose.model("UserModel",userSchema)

app.post("/register",(req,res)=>{
     console.log(req.body) 
    const {firstName,lastName,email,password,confirmpassword} = req.body;
    UserModel.findOne({email: email},(err,user)=>{
            if(user){
                res.send({message : "This Email-id already Exists"})
            }
            else{
                const user = new UserModel({
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmpassword,
                })
                user.save();
                res.send({message : "REGISTRATION SUCCESS!!!"})
            }
    })

})

app.post("/login",(req,res)=>{
    console.log(req.body)
    const {email,password} = req.body
    UserModel.findOne({email : email},(err,user)=>{
            if(user){
                if(password == user.password){
                    res.send({message : "Login SuccessFull",user})
                }
                else{
                    res.send({message : "Password Not Match"})
                }
            }
            else{
                res.send({message : "You Are Not Registered"})
            }
    })
})

app.listen(3001,()=>{
    console.log("Server is runing at port 3001")
})