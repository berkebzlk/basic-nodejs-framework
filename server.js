const http = require("http");
const url = require("url");
const router = require("./routes");

const PORT = 8000;

const server = http.createServer((req, res) => {
    
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  const httpMethod = req.method;

  router.route(pathname, httpMethod);

  res.end(pathname);
});

server.listen(PORT, () => console.log("server listening on", PORT));
