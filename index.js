const { connectToMongoDB } = require('./src/config/dbConfig');
const app = require("./app");
const errorHandler  = require("./src/middlewares/errorHandler");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

//database connection
connectToMongoDB();

//add errorHandler
errorHandler();

app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`)
});
