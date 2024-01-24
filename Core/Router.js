class Router {
  constructor() {
    this.routerApplicationRoutes = []
  }

  get(uri, ...handlers) {
    this.routerApplicationRoutes.push({ 'get': { uri, handlers } })
  }

  post(uri, ...handlers) {
    this.routerApplicationRoutes.push({ 'post': { uri, handlers } })

  }

  put(uri, ...handlers) {
    this.routerApplicationRoutes.push({ 'put': { uri, handlers } })

  }

  patch(uri, ...handlers) {
    this.routerApplicationRoutes.push({ 'patch': { uri, handlers } })

  }

  delete(uri, ...handlers) {
    this.routerApplicationRoutes.push({ 'delete': { uri, handlers } })

  }

  use(...args) {
    if (typeof args[0] == 'string') {
      const uri = args[0]
      const handlers = args.slice(1);
      const httpMethods = ['get', 'post', 'put', 'patch', 'delete'];

      httpMethods.forEach(httpMethod => {
        if (typeof eval('this.' + httpMethod) == 'function') {
          eval('this.' + httpMethod + '(uri, ...handlers)')
        }
      })
    }
    else {
      let functionFlag = true;
      for (let i = 0; i < args.length; i++) {
        if (typeof args[i] != 'function') {
          functionFlag = false
        }
      }
      functionFlag && this.routerApplicationRoutes.push(args)
    }
  }

  route(uri, httpMethod, req, res) {
    // find handlers
    let handlers = [];
    let middlewares = [];
    let indexOfFoundUri = 0;
    for (let i = 0; i < this.routerApplicationRoutes.length; i++) {
      if (this?.routerApplicationRoutes[i][httpMethod]?.uri == uri) {
        handlers = this.routerApplicationRoutes[i][httpMethod].handlers;
        indexOfFoundUri = i;
      }
    }

    for (let i = 0; i < indexOfFoundUri; i++) {
      // if(typeof this.routerApplicationRoutes[i] == 'Array')
      if (Array.isArray(this.routerApplicationRoutes[i])) {
        middlewares.push(...this.routerApplicationRoutes[i])
      }
    }

    if (handlers.length == 0) {
      res.status(404).json('no such route');
    }

    const executeHandlers = (index, handlers) => {
      if (index < handlers.length) {
        const currentHandler = handlers[index];
        currentHandler(req, res, () => {
          executeHandlers(index + 1, handlers);
        });
      }
    };

    handlers = [...middlewares, ...handlers];
    executeHandlers(0, handlers)
  }
}

module.exports = Router;
