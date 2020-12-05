seed:
	npm run knex seed:run

migrate:
	npm run knex migrate:latest

dbsetup:
	make migrate
	make seed

rollback:
	npm run knex migrate:rollback

run:
	nodemon app.js
