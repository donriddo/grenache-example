const { PeerRPCServer } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const _ = require('lodash');

const order_books = {};

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const service = peer.transport('server')
service.listen(_.random(1000) + 1024)

setInterval(function () {
  link.announce('new_order', service.port, {})
  link.announce('list_orders', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log({ rid, key, payload })
  let response = 'no response';
  switch (key) {
    case 'new_order':
      if (!order_books[payload.name]) {
        order_books[payload.name] = [];
      }

      order_books[payload.name].push(payload.data);
      response = order_books;
      break;
    case 'list_orders':
      response = order_books;
      break;
    default:
      response = 'no response'
      break;
  }
  handler.reply(null, response)
})
