const { interval, from } = require('rxjs');
const { concatMap, delay, takeUntil } = require('rxjs/operators');
const axios = require('axios');

function getRandomProductId() {
  return Math.floor(Math.random() * 100) + 1;
}

function getProducts() {
  const products$ = interval(1000).pipe(
    concatMap(() => {
      const productId = getRandomProductId();
      console.log(`Requesting product ${productId}`);
      return from(axios.get(`https://dummyjson.com/products/${productId}`)).pipe(
        delay(10000)
      );
    }),
    takeUntil(interval(15000)) // interrompe a stream após 15 segundos
  );

  products$.subscribe((response) => {
    console.log(response.data);
  }, (error) => {
    console.error(`Ocorreu um erro ao requisitar o URL ${error.config.url} (número de tentativas: 3)`);
  }, () => {
    console.log('Stream finalizada');
  });
}

getProducts();

// adicionando funcao takeuntil para interromper a stream me levou cerca de 2h para achar algum lugar que explicasse sem gerar bug