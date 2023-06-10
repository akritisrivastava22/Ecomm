import User from "../models/user";
import JWT from "jsonwebtoken";
import asyncHandler from "../service/asyncHandler";
import config from "../config/index";
import CustomError from "../utils/customError";

export const isLoggedIn = asyncHandler(async(req,res,next) =>{
    let token;

    // In postman token is saved as Bearer <token> in authorization, so we have to check that way also 
    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startswith("Bearer"))){
    //We are putting value in token but we don't want it like Beare <token>, just the token thats why we use the split method
        token= req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError("Not authorized to accesss this resource", 400)
    }

    try {
        const decodedJWTPayload = JWT.verify(token,config.JWT_SECRET)

        req.user = await User.findById(decodedJWTPayload._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized to accesss this resource", 400)
    }
})

export const authorize = (...requiredRoles) => asyncHandler(async(req,res,next) => {

    if (!requiredRoles.includes(req.user.role)) {
        throw new CustomError("You are not authorized to access this resource")
    }
    next()
})