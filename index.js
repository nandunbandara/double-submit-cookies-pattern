const
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),

    app = express(),

    PORT = 9090;


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


app.listen(PORT, err => {
    if(err){
        console.error(`ERROR: Can not start server on ${PORT}`);
        return;
    }

    console.log(`SUCCESS: Server started on port ${PORT}`);
});
