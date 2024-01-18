class Router {
  routes = [];

  add(method, uri, controller) {
    this.routes.push({ method, uri, controller });

    return this;
  }

  get(uri, controller) {
    return this.add("GET", uri, controller);
  }
  post(uri, method) {
    return this.add("POST", uri, controller);
  }
  delete(uri, method) {
    return this.add("DELETE", uri, controller);
  }
  put(uri, method) {
    return this.add("PUT", uri, controller);
  }
  patch(uri, method) {
    return this.add("PATCH", uri, controller);
  }

  route(uri, method) {
    this.routes.forEach((route) => {
      if (route.uri === uri && route.method === method) {
        return route.controller();
      }
    });
  }
}

module.exports = Router;
