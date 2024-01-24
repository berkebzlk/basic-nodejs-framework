class Router {
  constructor() {
    this.routes = {
      get: {},
      post: {},
      put: {},
      patch: {},
      delete: {},
    };
  }

  get(uri, ...handlers) {
    this.routes.get[uri] = handlers;
    return this;
  }

  post(uri, ...handlers) {
    this.routes.post[uri] = handlers;
    return this;
  }

  put(uri, ...handlers) {
    this.routes.put[uri] = handlers;
    return this;
  }

  patch(uri, ...handlers) {
    this.routes.patch[uri] = handlers;
    return this;
  }

  delete(uri, ...handlers) {
    this.routes.delete[uri] = handlers;
    return this;
  }

  route(uri, httpMethod, req, res) {
    const handlers = this.routes[httpMethod][uri];
    console.log(handlers)
    if (handlers) {
      const executeHandlers = (index) => {
        if (index < handlers.length) {
          const currentHandler = handlers[index];
          currentHandler(req, res, () => {
            executeHandlers(index + 1);
          });
        }
      };

      executeHandlers(0);
    } else {
      res.status(404).json('no such route');
    }
  }
}

module.exports = Router;
