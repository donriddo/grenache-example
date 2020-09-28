const http = require('http');
const { isEmpty, uniq } = require('lodash');

const clientPeer = require('./client');

function processResponse(res, body) {
  console.log({ body });
  if (!isEmpty(body)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(Array.isArray(body) ? pruneResult(body) : body)
    );
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Invalid URL sent'
    }));
  }
}

function pruneResult(results) {
  return uniq(
    results.map(
      result => JSON.stringify(result)
    )
  ).map(
    result => JSON.parse(result)
  )[0]
}


http.createServer((request, response) => {
  const { url } = request;

  request.on('error', (err) => {
    console.error(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: 'Something went wrong'
    }));
  }).on('data', (chunk) => {
    const reqBody = JSON.parse(chunk.toString());
    switch (url) {
      case '/new-order':
        clientPeer.map('new_order', reqBody, { timeout: 10000 }, (err, data) => {
          if (err) {
            console.error(err)
          }
          console.log(data)
          processResponse(response, data);
        })
        break;
      case '/list-orders':
        clientPeer.request('list_orders', null, { timeout: 10000 }, (err, data) => {
          if (err) {
            console.error(err)
          }
          console.log(data)
          processResponse(response, data);
        })
        break;

      default:
        processResponse(response, null);
        break;
    }
  });
}).listen(9080);
