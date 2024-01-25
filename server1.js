const App = require('./Core/App');
const Router = require('./Core/Router');

const app = new App();
const router = new Router();
router.get('/routerUri1', (req, res) => {res.json('routerUri1')})

app.get('/uri1', (req, res) => { console.log('handler1'); res.json('handler1') })
app.get('/uri2', (req, res) => { console.log('handler2'); res.json('handler2') })
app.get('/uri1', (req, res, next) => { console.log('middleware executed'); next(); }, (req, res) => { console.log('handler3'); res.json('handler3') })
app.post('/postUri1', (req, res) => { res.json('postUri1') })

const middleware1 = (req, res, next) => { console.log('middleware1'); next() }
const middleware2 = (req, res, next) => { console.log('middleware2'); next() }
const middleware3 = (req, res, next) => { console.log('middleware3'); next() }
app.use(middleware1, middleware2, middleware3)

app.get('/uri3', (req, res, next) => {console.log('uri3 middleware'); next();}, (req, res) => { console.log('uri3'); res.json('uri3') })

app.use('/uri4', middleware1, (req, res) => {console.log('uri 4'); res.json('uri4 response')})

app.use('/uri5', (req, res, next) => {console.log(1); next()}, (req, res, next) => {console.log(2); next()}, (req, res, next) => {console.log(3); next()}, router)

const router2 = new Router();

router2.get('/router2', (req, res) => res.json('router2'))

app.use('/uri6', (req,res,next) => {console.log(123); next();}, router2);

// console.log(app.applicationRoutes)
console.log(app.applicationRoutes[app.applicationRoutes.length-10])

/*
we can use
**********
app.use(middlewares)

app.use(uri, router)
app.use(uri, middlewares, router)

app.use(uri, controller)

----router
router.use(middlewares)

router.get(uri, controller)
router.get(uri, middlewares, controller)

*/
const PORT = 5000;

app.listen(5000, () => console.log('Server is listening on port', PORT));
