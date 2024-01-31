const http = require("http");
const url = require("url");

const Router = require("./Router");

class App {
  httpMethods = ["get", "post", "patch", "put", "delete"];

  constructor() {
    this.applicationRoutes = {
      get: [],
      post: [],
      patch: [],
      put: [],
      delete: [],
    };
  }

  use(...args) {
    if (typeof args[0] == "string") {
      const uri = args[0];
      // last parameter is router
      if (args[args.length - 1] instanceof Router) {
        const routerMiddlewares = [];

        // if theres middleware before router obj we should add it to our applicationRoutes
        if (args.length == 3) {
          routerMiddlewares.push(args[1]);
        }
        if (args.length > 3) {
          routerMiddlewares.push(...args.slice(1, args.length - 1));
        }

        // adding
        for (let i = 0; i < this.httpMethods.length; i++) {
          const routeObject = {};
          routeObject[uri] = {
            handlers: routerMiddlewares,
            router: args[args.length - 1],
          };
          this.applicationRoutes[this.httpMethods[i]].push(routeObject);
        }
      } else {
        const handlers = args.slice(1);

        this.httpMethods.forEach((httpMethod) => {
          if (typeof eval("this." + httpMethod) == "function") {
            eval("this." + httpMethod + "(uri, ...handlers)");
          }
        });
      }
    }
    // application level middlewares
    else {
      let functionFlag = true;
      for (let i = 0; i < args.length; i++) {
        if (typeof args[i] != "function") {
          functionFlag = false;
        }
      }
      for (let i = 0; i < this.httpMethods.length; i++) {
        functionFlag && this.applicationRoutes[this.httpMethods[i]].push(args);
      }
    }
  }

  get(uri, ...handlers) {
    const uriObj = {};
    uriObj[uri] = { handlers };
    this.applicationRoutes["get"].push(uriObj);
  }

  post(uri, ...handlers) {
    const uriObj = {};
    uriObj[uri] = { handlers };
    this.applicationRoutes["post"].push(uriObj);
  }

  put(uri, ...handlers) {
    const uriObj = {};
    uriObj[uri] = { handlers };
    this.applicationRoutes["put"].push(uriObj);
  }

  patch(uri, ...handlers) {
    const uriObj = {};
    uriObj[uri] = { handlers };
    this.applicationRoutes["patch"].push(uriObj);
  }

  delete(uri, ...handlers) {
    const uriObj = {};
    uriObj[uri] = { handlers };
    this.applicationRoutes["delete"].push(uriObj);
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

    const compareUriParts = (appUriParts, incomingUriParts) => {
      if (appUriParts.length != incomingUriParts.length) return false;

      for (let i = 0; i < appUriParts.length; i++) {
        if (appUriParts[i].charAt(0) == ':') continue;

        if (appUriParts[i] != incomingUriParts[i]) return false
      }
      return true
    }

    const getParams = (currentUriParts, incomingUriParts) => {
      const paramIndexes = []
      for (let i = 0; i < currentUriParts.length; i++) {
        if (currentUriParts[i].startsWith(':')) {
          paramIndexes.push(i)
        }
      }

      if (paramIndexes.length == 0) return null;

      const obj = {}
      paramIndexes.forEach(index => {
        obj[currentUriParts[index].slice(1)] = incomingUriParts[index]
      })

      return obj
    }

    const routes = this.applicationRoutes[httpMethod];
    const appRoutes = this.applicationRoutes[httpMethod];


    for (let i = 0; i < appRoutes.length; i++) {
      // this is middleware. not a route object
      if (Array.isArray(appRoutes[i])) continue;

      const appUri = Object.keys(appRoutes[i])[0]

      const appUriParts = appUri.split('/')
      const incomingUriParts = uri.split('/')

      // if route contains a router
      if (appRoutes[i][appUri]?.router) {
        const routerRoutes = appRoutes[i][appUri].router.routerApplicationRoutes[httpMethod];

        for (let j = 0; j < routerRoutes.length; j++) {
          // this is router's middleware
          if (Array.isArray(routerRoutes[j])) continue;
          const routerUri = Object.keys(routerRoutes[j])[0];
          const appAndRouterParts = (appUri + routerUri).split('/');

          if (!compareUriParts(appAndRouterParts, incomingUriParts)) continue

          // parametreleri çek
          const obj = getParams(appAndRouterParts, incomingUriParts);
          console.log('obj', obj)
          // bulunan indexi ayarla -> i
          indexOfFoundUri = i;
          applicationHandlers = [...appRoutes[i][appUri].handlers, ...appRoutes[i][appUri].router.route(routerUri, httpMethod, req, res)]
          break;
        }
      } else {
        if (!compareUriParts(appUriParts, incomingUriParts)) continue;

        const obj = getParams(appUriParts, incomingUriParts);

        req.params = obj;

        applicationHandlers = appRoutes[i][appUri].handlers
        indexOfFoundUri = i;
        break;
      }
    }

    // there is no such found
    if (indexOfFoundUri == -1) {
      res.status(404).json("no such route");
    }

    for (let i = 0; i < indexOfFoundUri; i++) {
      if (Array.isArray(routes[i])) {
        applicationMiddlewares.push(...routes[i]);
      }
    }

    applicationHandlers = [...applicationMiddlewares, ...applicationHandlers];
    executeHandlers(0, applicationHandlers);
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
      };
      res.json = (json) => {
        res.write(JSON.stringify(json));
        return res.end();
      };

      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      const query = parsedUrl.query;

      const httpMethod = req.method;

      this.route(pathname, httpMethod.toLocaleLowerCase(), req, res);
    });

    server.listen(port, callback);
  }
}

module.exports = App;
