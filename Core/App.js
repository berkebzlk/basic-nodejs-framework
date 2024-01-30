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

    const routes = this.applicationRoutes[httpMethod];
    const routesUris = [];

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if (!Array.isArray(route)) {
        routesUris.push(Object.keys(route)[0]);
      }
    }

    for (let i = 0; i < routesUris.length; i++) {
    
        // 1- eşit mi?
        if (routesUris[i] == uri) {
            console.log(1)
        } 
        // 2- length eşit mi?
        // 3- router içne git
    }

    
    // app router içinde dolaş
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if (!Array.isArray(route)) {
        routesUris.push(Object.keys(route));
      }

      // handler varsa ve router yoksa uri eşleşirse route bulundu demektir.
      if (route?.handlers?.length > 0 && !route?.router) {
        applicationHandlers = routes[i][uri].handlers;
        indexOfFoundUri = i;
      }
      // router varsa
      else if (route?.router) {
        const router = route.router;

        const appRouteUri = Object.keys(routes[i]);

        if (router?.routerApplicationRoutes) {
          const routerUris = [];
          const routerRoutes = router.routerApplicationRoutes[httpMethod];
          // routerRoutes içinde dolaşıp keyleri al
          for (let j = 0; j < routerRoutes.length; j++) {
            if (!Array.isArray(routerRoutes[j])) {
              routerUris.push(Object.keys(routerRoutes[j])[0]);
            }
          }

          let routerUri = "";
          // app uri + key == gelen uri?
          for (let j = 0; j < routerUris.length; j++) {
            if (appRouteUri + routerUris[j] == uri) {
              routerUri = routerUris[j];
            }
          }

          if (routerUri) {
            if (routes[i][appRouteUri].handlers.length > 0) {
              applicationHandlers = [
                ...routes[i][appRouteUri].handlers,
                ...routes[i][appRouteUri].router.route(
                  routerUri,
                  httpMethod,
                  req,
                  res
                ),
              ];
            } else {
              applicationHandlers = routes[i][appRouteUri].router.route(
                routerUri,
                httpMethod,
                req,
                res
              );
            }
            indexOfFoundUri = i;
          }
        }
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
