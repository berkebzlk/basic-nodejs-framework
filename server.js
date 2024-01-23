const App = require('./Core/App');
const Router = require('./Core/Router');

const app = new App();
const router = new Router();

app.get('/uri', (req, res) => { console.log('berke'); res.json('berke') })

app.get('/uri2', (req, res, next) => {console.log('middleware1'); next();}, 
                    (req, res, next) => {console.log('middleware2'); next()}, 
                    (req, res) => { console.log('berke2'); res.json('berke2') })

app.get('/uri3', (req, res) => { console.log('berke3'); res.json('berke3') })

const PORT = 5000;

console.log(app.router)
app.listen(5000, () => console.log('Server is listening on port', PORT));
