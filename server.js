
const exampleRouter1 = require("./routes/exampleRoutes1");
const exampleRouter2 = require("./routes/exampleRoutes2");
const App = require('./Core/App');

const app = new App();
app.use('/uri1', exampleRouter1);
app.use('/uri2', exampleRouter2);

const PORT = 5000;

app.listen(5000, () => console.log('Server is listening on port', PORT));
