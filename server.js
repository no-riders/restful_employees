const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const employeesRoute = require('./api/routes/employees');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;

app.use('/employees', employeesRoute);

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
