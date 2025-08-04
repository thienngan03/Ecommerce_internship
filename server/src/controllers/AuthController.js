const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {models} = require("../models");
const joi = require('joi');
const {comparePassword, generatAccessToken,generateRefreshToken} = require("../middleware/authentication"); 

class AuthController {
    postRegister = async (req, res) => {
        try {
            const {email, password, role } = req.body;
            const schema = joi.object({
                email: joi.string().email().required(),
                password: joi.string().required()
            });
            const {error} = schema.validate({email, password});
            if (error) {
                return res.status(400).json({message: error.details[0].message});
            }
            const existingUser = await models.Account.findOne({where: {email}});
            if (existingUser) {
                return res.status(400).json({message: "email already exists"});
            }
            const newUser = await models.Account.create({email, password, role});
            if (role === 'seller') {
                await models.Seller.create({
                    accountId: newUser.id
                });
            } else if (role === 'buyer') {
                await models.Buyer.create({
                    accountId: newUser.id
                });
            }
            res.status(201).json({message: "User registered successfully", newUser: {id: newUser.id, email: newUser.email, role: newUser.role}});
        } catch (error) {
            console.error("Error during registration:", error);     
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    postLogin = async (req, res) => {
        try {
            const {email, password} = req.body;

            // Validate input
            const schema = joi.object({
                email: joi.string().required(),
                password: joi.string().required()
            });
            const {error} = schema.validate({email, password});
            if (error) {
                return res.status(400).json({message: error.details[0].message});
            }

            // Find user
            const user = await models.Account.findOne({where: {email}});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
            // Compare password
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({message: "Invalid password"});
            }

            // Generate token
            const accesstoken = generatAccessToken({id: user.id});
            const refreshToken = generateRefreshToken({id: user.id});

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: parseInt(process.env.COOKIE_EXPIRE), // Set cookie expiration from environment variable[]
            });

            const userData = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            res.status(200).json({
                message: "Login successful",
                user: userData,
                accessToken: accesstoken,
                refreshToken: refreshToken
            });
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    getToken = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({message: "No refresh token provided"});
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({message: "Invalid refresh token"});
                }
                const  user= await models.Account.findByPk(decoded.id);
                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }

                const accesstoken = generatAccessToken({user});

                res.status(200).json({
                    message: "Access token generated successfully",
                    accessToken: accesstoken
                });
            });
        } catch (error) {
            console.error("Error generating access token:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    postLogout = async (req, res) => {
        try {
            res.clearCookie('refreshToken');
            res.status(200).json({message: "Logged out successfully"});
        } catch (error) {
            console.error("Error during logout:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    changePassword = async (req, res) => {
        try {
            const {userId, oldPassword, newPassword} = req.body;

            // Validate input
            const schema = joi.object({
                userId: joi.number().required(),
                oldPassword: joi.string().required(),
                newPassword: joi.string().required()
            });
            const {error} = schema.validate({userId, oldPassword, newPassword});
            if (error) {
                return res.status(400).json({message: error.details[0].message});
            }

            // Find user
            const user = await models.Account.findOne({where: {id: userId}});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            // Compare old password
            const isOldPasswordValid = await comparePassword(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return res.status(401).json({message: "Invalid old password"});
            }

            user.password = newPassword; // Assuming password hashing is handled in the model hook
            await user.save();

            res.status(200).json({message: "Password updated successfully"});
        } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
};
module.exports = new AuthController();