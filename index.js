const express= require('express');
const mongoose = require('mongoose')

const { connectMongoDb } = require('./connection');
const User = require('./models/user');

const app= express();
const PORT= 8000;

//connection
connectMongoDb("mongodb://127.0.0.1:27017/Db_crud")
                .then(()=> console.log("Mongodb connected"))
                .catch((err)=> console.log('Mongo Error',err)); 

//Middleware
 app.use(express.urlencoded({ extended: false}));

//ROUTES

//Creating a User
app.post('/api/users',async(req,res)=>{
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
        ) {
            return res.status(400).json({msg: "All fields are required"});
        }
        const result = await User.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
            jobTitle: body.job_title
        });

        return res.status(201).json({msg:"Success"});
});  


//RETRIEVING THE USERS
app.get('/api/users',async(req, res) => {
    const allDbUsers = await User.find({});

    return res.json(allDbUsers);
});

app.route('/api/users/:id')
.get(async (req,res)=>{
    //Finding a Particular User
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({error: "user not found"});
    return res.json(user);
})
.patch(async (req,res)=>{
// Editing a particular User
await User.findByIdAndUpdate(req.params.id,{firstName:"Aadil"});
return res.json({Status: "Success"});
})
.delete(async (req,res)=>{
//Deleting a particular User
    await User.findByIdAndDelete(req.params.id)
    return res.json({status:"Sucess"})
});


app.listen(PORT, ()=>console.log(`Server started at ${PORT}`));