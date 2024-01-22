class Router {
  routes = [];

  add(method, uri, controller) {
    this.routes.push({ method, uri, controller });

    return this;
  }

  get(uri, controller) {
    return this.add("GET", uri, controller);
  }
  post(uri, controller) {
    return this.add("POST", uri, controller);
  }
  delete(uri, controller) {
    return this.add("DELETE", uri, controller);
  }
  put(uri, controller) {
    return this.add("PUT", uri, controller);
  }
  patch(uri, controller) {
    return this.add("PATCH", uri, controller);
  }

  route(uri, method, req, res) {

    let uriFound = false

    this.routes.forEach((route) => {
      if (route.uri === uri && route.method === method) {
        route.controller(req, res);
        uriFound = true
      }
    });
    
    if (!uriFound) {
      res.status(404).json('No such route')
    }
  }
}

module.exports = Router;
