const {models} = require("../models/index.js");
const sequelize = require("sequelize");


const replaceUrl = (url, req) => {
    if(url && !url.startsWith('http')) {
        url = url.replace(/^.*[\\\/]public[\\\/]/, "/");
        url = `${req.protocol}://${req.get('host')}${url}`;
    }
    return url;
};
const getRandomElements = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
const createSignature = (transaction) => {
    var CryptoJS = require("crypto-js");
    const {signature, ...body} = transaction;
    const value = Object.keys(body)
        .sort()
        .reduce(
            (acc, key) => 
                (acc += 
                    typeof body[key] === 'object' 
                        ? JSON.stringify(body[key]) 
                        : body[key]),         
            '',
        );
    const hash = CryptoJS.HmacSHA256(value, process.env.TRANSACTION_SECRET);
    return hash.toString(CryptoJS.enc.Hex);
}
module.exports = {
    replaceUrl,
    getRandomElements,
    createSignature
};
