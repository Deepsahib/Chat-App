import mongoose from 'mongoose';
const userschema = new mongoose.Schema({
  phoneNumber: {type: String},
  phoneSuffix: {type: String},
  userName: {type: String},
  email: {type: String},
  emailOtp:{type:String},
  emailOtpExpiry:{type:String},
  profilePicture:{type:String},
  about:{type:String},
  lastSeen:{type:String},
  isOneLine:{type:Boolean, default:false},
  isVerified:{type:Boolean, default:false},
  agreed:{type:Boolean, default:false},
},{timestamps:true});
  export default mongoose.model('User', userschema);
  