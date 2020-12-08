### Student Registry
This Node project is created based on these [requirements](https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef).

## Setup local environment
**Prerequisite**:
- Docker: Mysql setup and database creation required for the API. Does not include the setup of Node API.
- Node

```sh
$ docker-compose up
```

**Fastest setup**
This `make` command runs the migration, seeds the database and spins up a server
```sh
$ make setuprun
```
**Step by step**
If you prefer to run step at a time, run the following commands
```sh
$ npm i             # runs npm install
$ make migrate      # runs migration
$ make seed         # seeds the database
$ make run          # starts a server
```

### Run tests
```sh
$ npm test
```