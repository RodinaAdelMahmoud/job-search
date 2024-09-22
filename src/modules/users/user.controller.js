import userModel from "../../../db/models/user.model.js"
import { AppError } from "../../../utils/classError.js";
import { asyncHandler } from './../../../utils/globalErrorHandler.js';
import {  sendEmail } from './../../service/sendEmail.js';
import jwt from "jsonwebtoken";
import  bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";


export const getUsers = async (req,res,next) =>{
    const users = await userModel.find()
    res.status(200).json({msg:"done",users})
}

// =========================SignUp=========================================

export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, recoveryEmail, password, phone, birthday, role } = req.body;

    const emailExist = await userModel.findOne({ email: email.toLowerCase() });
emailExist && next(new AppError("User already exists", 409))
    const token = jwt.sign({ email }, process.env.signatureKey, { expiresIn: 60 * 2 });
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

    await sendEmail(email, "Verify your email", `<a href="${link}">Click here to verify your email</a>`);

    const hash = bcrypt.hashSync(password, +process.env.saltRound);

    const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        recoveryEmail,
        password: hash,
        phone,
        birthday,
        role: role || 'user' 
    });
    

    res.status(201).json({ msg: "User created successfully", user: newUser });
});


// =========================Verify=========================================

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.signatureKey);
        if (!decoded?.email) {
            return next(new AppError("Invalid token", 400));
        }

        const user = await userModel.findOneAndUpdate(
            { email: decoded.email, confirmed: false },
            { confirmed: true },
            { new: true }
        );

        if (!user) {
            return next(new AppError("User not found or already confirmed", 400));
        }

        res.status(200).json({ msg: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        next(new AppError("Token verification failed", 500));
    }
});

// =========================SignIn=========================================
export const signIn = asyncHandler(async (req, res, next) => {
    const { userName, password } = req.body;

    const emailExist = await userModel.findOne({ userName });

    if (!emailExist || !bcrypt.compareSync(password, emailExist.password)) {
        return res.status(400).json({ msg: "userName or password is incorrect" });
    }

    emailExist.status = true;
    const updatedUser = await emailExist.save();

    const token = jwt.sign({ id: emailExist._id, email }, process.env.signatureKey);

    res.status(200).json({ msg: "Sign-in successful", token });
});

  // =========================UpdateUser=========================================

  export const updateUser = asyncHandler(async (req, res, next) => {
    const { email, phone, recoveryEmail, dateOfBirth, lastName, firstName } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { email, phone, recoveryEmail, dateOfBirth, lastName, firstName },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "done", user });
    } catch (error) {
        res.status(500).json({ msg: "Update failed", error });
    }
});


  // =========================deleteUser=========================================
  export const deleteAccount = asyncHandler(async (req, res, next) => {
    try {
        const user = await userModel.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete account", error });
    }
});


// =========================GetProfile=========================================
export const getProfile = asyncHandler(async (req, res) => {
    try {
        res.status(200).json({ msg: "done", user: req.user });
    } catch (error) {
        res.status(500).json({ msg: "Catch error", error });
    }
});

// =========================GetUserProfile=========================================

export const getUserProfile = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await userModel.findById(userId).select('-password');  // Exclude password for security

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "User profile retrieved successfully", user });
    } catch (error) {
        res.status(500).json({ msg: "Failed to retrieve user profile", error });
    }
});

// =========================UpdatePassword=========================================



export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; 

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            console.error(`User with userId ${userId} not found`);
            return res.status(404).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};



// =========================Forgetpass=========================================
export const forgotPassword = asyncHandler( async (req, res, next) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const otp = customAlphabet("0123456789", 5);
    const newOtp = otp()
    
    await userModel.updateOne({ email }, { otp });

    await sendEmail(email, "OTP for Password Reset", `<h1>Your OTP is: ${newOtp} </h1>`);
    await userModel.updateOne({email},{otp: newOtp})

    res.status(200).json({ msg: 'OTP sent successfully' });
}) ;





export const resetPassword = async (req, res, next) => {
    const { email, otp, password } = req.body;
const user = await userModel.findOne({email: email.toLowerCase()})
if(!user){
    return next(new AppError("user not exist",404))
}
if(user.otp !== otp || otp == ""){
    return next(new AppError("invalid otp",400))
}
const hash = bcrypt.hashSync(password, +process.env.saltRound)
await userModel.updateOne({email}, {password: hash , otp: ""})
res.status(200).json({msg:"done"})


};
// =========================RecoveryEmail=========================================


export const getUsersByRecoveryEmail = async (req, res, next) => {
    const { recoveryEmail } = req.query;
  
    if (!recoveryEmail) {
      return next(new AppError('Recovery email parameter is required', 400));
    }
  
    try {
      const users = await userModel.find({ recoveryEmail: recoveryEmail.toLowerCase() });
  
      if (!users || users.length === 0) {
        return next(new AppError('No accounts found for the specified recovery email', 404));
      }
  
      res.status(200).json({ msg: 'Users found', users });
    } catch (error) {
      next(new AppError('Failed to retrieve user profile', 500));
    }
  };