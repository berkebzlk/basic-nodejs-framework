const App = require('./Core/App');
const app = new App();
const userRouter = require('./router')

const PORT = 5000;

const mw1 = (req, res, next) => {
    console.log('mw1')
    next()
}
const mw2 = (req, res, next) => {
    console.log('mw2')
    next()
}
const mw3 = (req, res, next) => {
    console.log('mw3')
    next()
}

// application level middleware
app.use(mw1, mw2, mw3)

// app.get(uri, controller)
app.get('/uri1', (req, res) => {res.json('uri1')})

// app.get(uri, middlewares, controller)
app.use('/uri2', mw3, mw2, mw1, (req, res) => {res.json('uri3')})

// app.use(uri, middlewares, router)
app.use('/user', mw3, mw2, mw1, userRouter)



app.listen(PORT, () => console.log('server is listening on', PORT));

