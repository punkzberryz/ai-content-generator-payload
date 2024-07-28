compose-up:
	docker compose up -d
compose-down:
	docker compose down

db-migrate-create:
#Create a new migration file in the migrations directory.
#You can optionally name the migration that will be created.
#By default, migrations will be named using a timestamp.
	pnpm run payload migrate:create
db-migrate-push:
#The migrate command will run any migrations that have not yet been run.
	pnpm run payload migrate
db-migrate-down:
#Roll back the last batch of migrations.
	pnpm run payload migrate:down
db-migrate-status:
# check the status of migrations and output a table of which
# migrations have been run, and which migrations have not yet run.
	pnpm run payload migrate:status
db-migrate-fresh:
#Drops all entities from the database and re-runs all migrations from scratch.
	pnpm run payload migrate:fresh