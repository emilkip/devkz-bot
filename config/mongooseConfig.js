const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const mongooseOptions = {
    promiseLibrary: Promise
};

module.exports.mongooseOptions = mongooseOptions;
module.exports.mongoose = mongoose;
