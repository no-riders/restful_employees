const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const employeesRoute = require('./api/routes/employees');
const shiftsRoute = require('./api/routes/shifts');


mongoose.connect('mongodb://effg:' + process.env.MONGO_ATLAS_PW + '@employees-shard-00-00-tx7nb.mongodb.net:27017,employees-shard-00-01-tx7nb.mongodb.net:27017,employees-shard-00-02-tx7nb.mongodb.net:27017/test?ssl=true&replicaSet=employees-shard-0&authSource=admin', 
{
    useMongoClient: true
}
);

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

const PORT = process.env.PORT || 3000;

app.use('/employees', employeesRoute);
app.use('/shifts', shiftsRoute);

//must be after all routes
app.use((req, res, next) => {
    const error = new Error('Wrong page. Not found');
    error.status = 404;
    next(error);
})
//catch mongo errs
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})



app.listen(PORT, () => console.log(`Listening on ${PORT}`));
