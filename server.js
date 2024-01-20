const http = require("http");
const url = require("url");
const router = require("./routes");

const PORT = 5000;


const server = http.createServer((req, res) => {
  
  res.setHeader('Content-Type', 'application/json');
  res.json = (json) => res.end(JSON.stringify(json));

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  const httpMethod = req.method;

  router.route(pathname, httpMethod, req, res);
});

server.listen(PORT, () => console.log("server listening on", PORT));
