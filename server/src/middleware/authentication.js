const { compare } = require('bcrypt');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) { return res.status(401).json({ message: 'Unauthorized' }); }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { return res.status(403).json({ message: 'Forbidden' }); }
        req.user = user;
        next();
    });
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

const generatAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });
};
const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });
};      
module.exports = { authenticationToken, comparePassword, generatAccessToken, generateRefreshToken }; 