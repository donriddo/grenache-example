# GRENACHE EXAMPLE

## Steps to run the example

0. Clone this repository

1. Make sure you have grenache installed - `npm i -g grenache-grape`

2. Start two grape servers (on separate terminal tabs)

- `grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'`

- `grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'`

3. Start up two or more workers by running `node server.js` from separate terminal tabs

4. Start up the API server by running `node api.js`

5. Interact with the API server from any REST client

- To create a new order
  `POST localhost:9080/new-order`
  ```json
    {
      "name": "order name",
      "data": "<any data type>"
    }
  ```

- To list orders
  `GET localhost:9080/list-orders`
