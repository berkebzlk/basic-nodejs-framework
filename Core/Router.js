class Router {
  constructor() {
    this.routerApplicationRoutes = {
      get: [],
      post: [],
      patch: [],
      put: [],
      delete: [],
    };
  }

  get(uri, ...handlers) {
    // this.routerApplicationRoutes.push({ get: { uri, handlers } });
    const uriObj = {};
    uriObj[uri] = { handlers };
    this.routerApplicationRoutes["get"].push(uriObj);
  }

  post(uri, ...handlers) {
    this.routerApplicationRoutes.push({ post: { uri, handlers } });
  }

  put(uri, ...handlers) {
    this.routerApplicationRoutes.push({ put: { uri, handlers } });
  }

  patch(uri, ...handlers) {
    this.routerApplicationRoutes.push({ patch: { uri, handlers } });
  }

  delete(uri, ...handlers) {
    this.routerApplicationRoutes.push({ delete: { uri, handlers } });
  }

  use(...args) {
    const httpMethods = ["get", "post", "put", "patch", "delete"];

    if (typeof args[0] == "string") {
      const uri = args[0];
      const handlers = args.slice(1);

      httpMethods.forEach((httpMethod) => {
        if (typeof eval("this." + httpMethod) == "function") {
          eval("this." + httpMethod + "(uri, ...handlers)");
        }
      });
    } else {
      let functionFlag = true;
      for (let i = 0; i < args.length; i++) {
        if (typeof args[i] != "function") {
          functionFlag = false;
        }
      }

      httpMethods.forEach((httpMethod) => {
        functionFlag && this.routerApplicationRoutes[httpMethod].push(args);
      });
    }
  }

  route(uri, httpMethod, req, res) {
    // find handlers
    let handlers = [];
    let middlewares = [];
    let indexOfFoundUri = 0;

    const routes = this.routerApplicationRoutes[httpMethod];

    for (let i = 0; i < routes.length; i++) {
      if (!Array.isArray(routes[i])) {
        if (routes[i][uri]?.handlers.length > 0) {
          handlers = routes[i][uri].handlers;
          indexOfFoundUri = i;
        }
      }
    }
    
    for (let i = 0; i < indexOfFoundUri; i++) {
      if (Array.isArray(routes[i])) {
        middlewares.push(...routes[i]);
      }
    }

    handlers = [...middlewares, ...handlers];
    return handlers;
  }
}

module.exports = Router;
