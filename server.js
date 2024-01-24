const App = require('./Core/App');
const Router = require('./Core/Router');

const app = new App();
const router = new Router();

router.get('/uri1', (req, res) => { console.log('handler1'); res.json('handler1') })
router.get('/uri2', (req, res) => { console.log('handler2'); res.json('handler2') })
router.get('/uri1', (req, res, next) => { console.log('middleware executed'); next(); }, (req, res) => { console.log('handler3'); res.json('handler3') })
router.post('/postUri1', (req, res) => { res.json('postUri1') })

const middleware1 = (req, res, next) => { console.log('middleware1'); next() }
const middleware2 = (req, res, next) => { console.log('middleware2'); next() }
const middleware3 = (req, res, next) => { console.log('middleware3'); next() }
router.use(middleware1, middleware2, middleware3)

router.get('/uri3', (req, res, next) => {console.log('uri3 middleware'); next();}, (req, res) => { console.log('uri3'); res.json('uri3') })

router.use('/uri4', middleware1, (req, res) => {console.log('uri 4'); res.json('uri4 response')})

app.router = router
console.log(router.routerApplicationRoutes)

const PORT = 5000;

app.listen(5000, () => console.log('Server is listening on port', PORT));
