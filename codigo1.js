const { from } = require('rxjs');
const { concatMap, delay } = require('rxjs/operators');
const axios = require('axios');

function getUsers() {
  const usersIds$ = from(Array.from({ length: 10 }, (_, i) => i + 1));

  const users$ = usersIds$.pipe(
    concatMap((id) =>
      from(axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).pipe(delay(3000))
    )
  );

  users$.subscribe((response) => {
    console.log(response.data);
  });
}

getUsers();

// 30 min de leitura até conseguir entender o funcionamento da biblioteca com o node
// 15 min de codding