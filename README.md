### Student Registry
This Node project is created based on these [requirements](https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef).

## Setup local environment
**Prerequisite**: Docker is installed on your machine.

```sh
$ docker-compose up
```

For fastest setup, this command runs the migration, seeds the database and spins up a server
```sh
$ make setuprun
```

### Run tests
```sh
$ npm test
```