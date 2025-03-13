#!/bin/sh
# Wait until Postgres is ready

echo "script waiting for PostgreSQL to start..."

while ! nc -z $DB_HOST 5432; do
  sleep 1
done

echo "PostgreSQL is up - starting application"

exec "$@"
