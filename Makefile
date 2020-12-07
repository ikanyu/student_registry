seed:
	npm run knex seed:run

migrate:
	npm run knex migrate:latest

setuprun:
	npm i
	make migrate
	make seed
	make run

rollback:
	npm run knex migrate:rollback

run:
	nodemon server.js
