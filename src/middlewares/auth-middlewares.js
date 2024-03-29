const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/error/app-error');
const {UserService} = require('../services')

function validateAuthRequest(req,res,next){
    if(!req.body.email){
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(['Email not found incoming request'],StatusCodes.BAD_REQUEST);
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
    if(!req.body.password){
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(['Password not found incoming request'],StatusCodes.BAD_REQUEST);
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
    next();
}

async function checkAuth(req,res,next){
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        console.log(response);
        if(response){
            req.user = response; // setting user id in req object
            next();
        }
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
   
}

async function isAdmin(req,res,next){
    try {
        const response = await UserService.isAdmin(req.user);
        if(!response){
            return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({message:'User not authorized for this action'});
        }
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
    next();
}
module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
};