seed:
	knex seed:run

migrate:
	knex migrate:latest

dbsetup:
	make migrate
	make seed

rollback:
	knex migrate:rollback

run:
	nodemon app.js
