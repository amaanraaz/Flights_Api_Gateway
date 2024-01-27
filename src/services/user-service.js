const { StatusCodes } = require('http-status-codes');
const { UserRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/error/app-error');
const { Auth, Enums } = require('../utils/common');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data){
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.User_Roles_Enums.CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error.name == 'SequelizeValidationError' || error.name=='SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach(err => {
                explanation.push(err.message)
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function signIn(data){
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user find with given email', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        if(!passwordMatch){
            throw new AppError('Invalid Password', StatusCodes.BAD_REQUEST);
        }
        const jwt = Auth.createToken({id: user.id, email:user.email});
        return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try {
        if(!token){
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const res = Auth.verifyToken(token);
        const user = await userRepository.get(res.id);
        if(!user){
            throw new AppError('No User found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError'){
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError'){
            throw new AppError("JWT Token expired", StatusCodes.BAD_REQUEST);
        }
        throw error;
    }
}

async function addRoleToUser(data){
    try {
        const user = await userRepository.get(data.id);
        if(!user){
            throw new AppError('No user find with given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepository.getRoleByName(data.role);
        if(!role){
            throw new AppError('No user find with given role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports = {
    createUser,
    signIn,
    isAuthenticated,
    addRoleToUser
}