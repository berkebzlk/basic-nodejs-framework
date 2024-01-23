const http = require("http");
const url = require("url");

const Router = require('./Router');

class App {
    constructor() {
        this.router = new Router();
    }

    get(uri, ...handlers) {
        this.router.get(uri, ...handlers)
    }

    post(uri, ...handlers) {
        this.router.post(uri, handlers)
    }

    put(uri, ...handlers) {
        this.router.put(uri, handlers)
    }

    patch(uri, ...handlers) {
        this.router.patch(uri, handlers)
    }

    delete(uri, ...handlers) {
        this.router.delete(uri, handlers)
    }

    route(uri, httpMethod, req, res) {
        this.router.route(uri, httpMethod, req, res);
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.status = (statusCode) => {
                res.statusCode = statusCode;
                return res;
            }
            res.json = (json) => {
                res.write(JSON.stringify(json))
                return res.end();
            }

            const parsedUrl = url.parse(req.url, true);
            const pathname = parsedUrl.pathname;
            const query = parsedUrl.query;

            const httpMethod = req.method;

            this.route(pathname, httpMethod.toLocaleLowerCase(), req, res)
        });

        server.listen(port, callback);
    }
}

module.exports = App;