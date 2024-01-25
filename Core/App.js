const http = require("http");
const url = require("url");

const Router = require('./Router');

class App {
    constructor() {
        this.applicationRoutes = [];
    }

    use(...args) {
        // app.use('uri', x)
        // app.use(uri, handlers)
        // app.use(uri, Router)
        if (typeof args[0] == 'string') {
            const httpMethods = ['get', 'post', 'put', 'patch', 'delete'];
            const uri = args[0]
            if (args[args.length - 1] instanceof Router) {
                const routerMiddlewares = [];
                // eğer router'dan önce middleware verilmişse route'larımız arasına ekleyelim
                if (args.length == 3) routerMiddlewares.push(args[1])
                if (args.length > 3) routerMiddlewares.push(...args.slice(1, args.length - 1))
                for (let i = 0; i < httpMethods.length; i++) {
                    const httpMethod = httpMethods[i]
                    const routeObject = {}
                    routeObject[httpMethod] = { uri, handlers: routerMiddlewares, router: args[args.length - 1] }
                    this.applicationRoutes.push(routeObject)
                }

            } else {
                const handlers = args.slice(1);

                httpMethods.forEach(httpMethod => {
                    if (typeof eval('this.' + httpMethod) == 'function') {
                        eval('this.' + httpMethod + '(uri, ...handlers)')
                    }
                })
            }
        }
        // application level middlewares
        else {
            let functionFlag = true;
            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] != 'function') {
                    functionFlag = false
                }
            }
            functionFlag && this.applicationRoutes.push(args)
        }
    }

    get(uri, ...handlers) {
        this.applicationRoutes.push({ 'get': { uri, handlers } })
    }

    post(uri, ...handlers) {
        this.applicationRoutes.push({ 'post': { uri, handlers } })
    }

    put(uri, ...handlers) {
        this.applicationRoutes.push({ 'put': { uri, handlers } })
    }

    patch(uri, ...handlers) {
        this.applicationRoutes.push({ 'patch': { uri, handlers } })
    }

    delete(uri, ...handlers) {
        this.applicationRoutes.push({ 'delete': { uri, handlers } })
    }

    route(uri, httpMethod, req, res) {
        let applicationHandlers = [];
        let applicationMiddlewares = [];
        let indexOfFoundUri = -1;

        const executeHandlers = (index, handlers) => {
            if (index < handlers.length) {
                const currentHandler = handlers[index];
                currentHandler(req, res, () => {
                    executeHandlers(index + 1, handlers);
                });
            }
        };

        // searching routes that does not have router
        for (let i = 0; i < this.applicationRoutes.length; i++) {
            if (this.applicationRoutes[i][httpMethod]) {
                if (this.applicationRoutes[i][httpMethod]?.uri == uri) {
                    if(!this.applicationRoutes[i][httpMethod]?.router) {
                        if (this.applicationRoutes[i][httpMethod].handlers.length > 0) {
                            applicationHandlers = this.applicationRoutes[i][httpMethod].handlers;
                            indexOfFoundUri = i;
                        }
                    }
                }
            }
        }

        // no route found. we will search only routes that has router
        if (indexOfFoundUri == -1) {
            applicationHandlers = []
            applicationMiddlewares = []

            for (let i = 0; i < this.applicationRoutes.length; i++) {
                if (this.applicationRoutes[i][httpMethod]) {
                    if (this.applicationRoutes[i][httpMethod]?.router) {
                        // searching in router
                        if (this.applicationRoutes[i][httpMethod].router?.routerApplicationRoutes) {
                            for (let j = 0; j < this.applicationRoutes[i][httpMethod].router.routerApplicationRoutes.length; j++) {
                                if (this.applicationRoutes[i][httpMethod].uri + this.applicationRoutes[i][httpMethod].router.routerApplicationRoutes[j][httpMethod].uri == uri) {
                                    if(this.applicationRoutes[i][httpMethod].handlers.length > 0) {
                                        applicationHandlers = [...this.applicationRoutes[i][httpMethod].handlers, ...this.applicationRoutes[i][httpMethod].router.route(this.applicationRoutes[i][httpMethod].router.routerApplicationRoutes[j][httpMethod].uri, httpMethod, req, res)]
                                    } else {

                                        applicationHandlers = this.applicationRoutes[i][httpMethod].router.route(this.applicationRoutes[i][httpMethod].router.routerApplicationRoutes[j][httpMethod].uri, httpMethod, req, res);
                                    }

                                    indexOfFoundUri = i;
                                }
                            }
                        }

                    }
                }
            }
        }

        // there is no such found
        if (indexOfFoundUri == -1) {
            res.status(404).json("no such route")
        }

        for (let i = 0; i < indexOfFoundUri; i++) {
            if (Array.isArray(this.applicationRoutes[i])) {
                applicationMiddlewares.push(...this.applicationRoutes[i])
            }
        }

        applicationHandlers = [...applicationMiddlewares, ...applicationHandlers]
        executeHandlers(0, applicationHandlers);
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