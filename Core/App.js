const http = require("http");
const url = require("url");

const Router = require('./Router');

class App {
    constructor() {
        this.router = new Router();
    }

    use(uri, Router) {
        Router.routes.forEach(route => {
            this.router.routes.push({
                method: route.method,
                uri: uri + route.uri,
                controller: route.controller
            })
        })
    }

    route(uri, method, req, res) {
        this.router.route(uri, method, req, res);
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

            this.route(pathname, httpMethod, req, res)
        });

        server.listen(port, callback);
    }
}

module.exports = App;