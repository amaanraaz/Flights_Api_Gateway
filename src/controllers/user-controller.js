const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
/*
 Post: /signup
 req-body {email:'a@ab.com',password:"1223"}
*/ 
async function signUp(req,res){
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

/*
 Post: /signin
 req-body {email:'a@ab.com',password:"1223"}
*/ 
async function signIn(req,res){
    try {
        const user = await UserService.signIn({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    signUp,
    signIn
}