//signup a new user
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";
import User from "../models/user";
import mailHelper from "../utils/mailHelper";

//need to set httpOnly true so that user does not manipulate the cookie
export const cookieOptions = {
    expires: new Date(Date.now() + 3* 24*60*60*1000),
    httpOnly: true
}
export const signup = asyncHandler(async(req,res) =>{
    //get data from user
    const {name, email, password} = req.body

    //validation
    if(!name || email || !password) {
        throw new CustomError("Please add all fields", 400);
    }

    //let's add this data to db

    //checking if user already exists
    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new CustomError("User already exists", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTtoken()

    //safety as safety option in password doesn't work in create command and will show the password to user 
    user.password = undefined

    //store this token in user's cookie
    //httpOnly cookie set true means cookie cannot be read or wrritten from user end. It cannot be manipulated
    res.cookie("token", token, cookieOptions)

    //send back a response to user
    res.status(200).json({
        success:true,
        token,
        user
    })
})

export const login = asyncHandler( async(req,res) =>{
    const {email, password} = req.body

    //validation
    if(!email || !password){
        throw new CustomError("Please fill all details", 400)
    }

    const user = User.findOne({email}).select("+password")

    if(!user){
        throw new CustomError("Invalid credentials", 400)
    }

    //this is to match the password
    //comparePassword is coming from user model
    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
        const  token = user.getJWTtoken()
        user.password = undefinedres.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }
    throw new CustomError("Password is incorrect", 400)
})

export const logout = asyncHandler( async(req,res)=> {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        succes:true,
        message: "Logged Out"
    })
})

export const getProfile = asyncHandler(async(req,res) => {
    //destructuring req.user has name email and role so we are pulling it 
    const {user} = req
    if(!user) {
        throw new CustomError("User not found",401)
    }

    req.status(200).json({
        success: true,
        user
    })
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    //no email
    const user = await User.findOne({email})

    //checking if we fpund user from the email
    if (!user) {
        throw new CustomError("User not found", 404)
    }

    const resetToken = user.generateforgotpasswordtoken()

    await user.save({validateBeforeSave: false})

    //req.protocol is for getting if it is http or https 
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`

    const message = `Your password reset token is as follows \n\n ${resetUrl} \n\n if this was not requested by you, please ignore.`

    try {
        // to send the mail
        await mailHelper({
            email: user.email,
            subject: "Password reset mail",
            message
        })
    } catch (error) {
        // setting it undefined so it doesn't change the password by mistake as the mail it did not sent properly
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})

        throw new CustomError(error.message || "Email could not be sent", 500)
    }

})

export const resetPassword = asyncHandler(async (req, res) => {
    const {token: resetToken} = req.params
    const {password, confirmPassword} = req.body

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        //$gt means greater than 
        forgotPasswordExpiry: { $gt : Date.now() }
    })

    if (!user) {
        throw new CustomError( "password reset token in invalid or expired", 400)
    }

    if (password !== confirmPassword) {
        throw new CustomError("password does not match", 400)
    }

    user.password = password;
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    // optional

    const token = user.getJWTtoken()
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        user, //your choice
    })
})

