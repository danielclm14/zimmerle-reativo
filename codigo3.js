const { from, interval } = require('rxjs');
const { concatMap, delay, map } = require('rxjs/operators');
const axios = require('axios');

function getRandomProductId() {
  return Math.floor(Math.random() * 100) + 1;
}

function getProduct(productId) {
  return axios.get(`https://dummyjson.com/products/${productId}`);
}

function getProducts() {
  const products$ = interval(10000).pipe(
    map(() => getRandomProductId()),
    concatMap((productId) =>
      from(getProduct(productId)).pipe(
        delay(3000),
        map((response) => response.data)
      )
    )
  );

  products$.subscribe((product) => {
    console.log(product);
  });
}

getProducts();

// codigo legal de fazer, embora demorei mais, em torno de 1h para entender como funciona o mapeamento e o pipe sem bugar mas o subscribe foi parecido com o do codigo 2