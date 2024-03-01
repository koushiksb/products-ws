const logger = require("../utils/logger");
const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then((conn) => {
        logger.info(`MongoDB database connected with host: ${conn.connection.host}`);
    })
}

module.exports=connectDatabase;