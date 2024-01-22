
const exampleRouter = require("./routes");
const App = require('./Core/App');

const app = new App();

app.use('/uri', exampleRouter);

const PORT = 5000;

app.listen(5000, () => console.log('Server is listening on port', PORT));
