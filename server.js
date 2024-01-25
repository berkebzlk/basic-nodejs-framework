const App = require('./Core/App');
const app = new App();

const userRouter = require('./router/index');

const PORT = 5000;

const verifyJwt = (req,res,next) => {
    req.isJwtOK = true
    if(req.isJwtOK) next();
    // you can set req object in ./Core/App.js -> listen method
}

app.get('/home', (req, res) => {res.json('Home')});
app.use(verifyJwt) 
// user route require jwt verify!
app.use('/user', userRouter);

app.listen(PORT, () => console.log('server is listening on', PORT));

