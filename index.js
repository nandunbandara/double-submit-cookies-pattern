const
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    randomBytes = require('random- bytes'),

    app = express(),

    // application constants
    PORT = 9090,
    USERNAME = "demo",
    PASSWORD = "pass123$";


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(PORT, err => {
    if(err){
        console.error(`ERROR: Can not start server on ${PORT}`);
        return;
    }

    console.log(`SUCCESS: Server started on port ${PORT}`);
});

app.get('/', (req, res) => {
    
    
});

// handle user login and token generation
app.post('/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    // validate user input
    if(username === undefined || username === ""){
        res.status(400).json({ success:false, message: "Username undefined"});
        return;
    }

    if(password === undefined || password === ""){
        res.status(400).json({ success:false, message: "Password undefined"});
        return;
    }

    if(username === USERNAME && password === PASSWORD) {

        // generate session info
        let session_id = Buffer.from(randomBytes.sync(32)).toString('base64');
        let csrf_token = Buffer.from(randomBytes.sync(32)).toString('base64');

        res.setHeader('Set-Cookie', [
            `session-id=${session_id}`,
            `csrf-token=${csrf_token}`,
            `time=${Date.now()}`
        ]);

        res.sendFile('public/form.html', { root: __dirname });

    } else {

        res.status(405).json({ success:false, message:"Unauthorized user"});
        res.redirect('/');

    }
});

app.post('/post', (req, res) => {

    let session_id = req.cookies['session-id'];
    let csrf_token = req.cookies['csrf-token'];

    if(session_id){

        // compare csrf tokens in cookies and request body
        if(csrf_token === req.body.csrf_token){
            res.status(200).json({ success:true });
        } else {
            res.status(400).json({ success:false });
        }

    } else {
        res.sendFile('public/login.html', { root: __dirname });
    }
});

// logout user from the application
app.post('/logout', (req, res) => {

    let session_id = req.cookies['session-id'];
    delete SESSION_DATA[session_id]; // remove csrf token from memory

    res.clearCookie('session-id');
    res.clearCookie('time');

    res.sendFile('public/login.html', { root: __dirname });

});


// explicit calls to routes
app.get('/login', (req, res) => {
    
    const session_id = req.cookies['session-id'];

    if(session_id && SESSION_DATA[session_id]){
        res.sendFile('public/form.html', { root: __dirname });
    } else {
        res.sendFile('public/login.html', { root: __dirname });
    }
})