const { from } = require('rxjs');
const { concatMap, delay, retryWhen, take } = require('rxjs/operators');
const axios = require('axios');

function getUsers() {
  const statusCodes$ = from(Array.from({ length: 10 }, (_, i) => i + 401));

  const urls$ = statusCodes$.pipe(
    concatMap((code) => {
      const url = `https://httpbin.org/status/${code}`;
      return from(axios.get(url)).pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(3000),
            take(3),
            concatMap((error, i) => {
              const errorMsg = `Ocorreu um erro ao requisitar o URL ${url} (número de tentativas: ${i + 1})`;
              if (i < 2) {
                console.error(errorMsg);
                return from(delay(3000));
              } else {
                return from(Promise.reject(new Error(errorMsg)));
              }
            })
          )
        )
      );
    })
  );

  urls$.subscribe(
    (response) => {
      console.log(response.data);
    },
    (error) => {
      console.error(error.message);
    }
  );
}

getUsers();

// 30 min adaptando o codigo com subscribe e retry porem nao consegui fazer ir até 3 nos testes