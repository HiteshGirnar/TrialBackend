import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        lowercase: true,
        index:true,
        trim: true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        lowercase: true,
        trim: true,
        unique:true
    },
    fullname:{
        type: String,
        required:true,
        index:true,
        trim: true,
    },
    avatar:{
        type: String, //cloudinary url

    },
    coverimage:{
        type: String, //cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref :"Video"
         }
    ],
    password:{
        type: String,
        required:[true,'password is required'],
    },
    refreshToken:{
        type: String,
    }
    },
    {timestamps:true},
)
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})

userSchema.method.isPasswordCorrect =async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id:_this._id,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
)}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id:_this._id,
        email:this.email,
        username:this.username
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
)}

export const User = mongoose.model("User",userSchema)