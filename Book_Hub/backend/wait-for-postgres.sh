#!/bin/sh
# wait-for-postgres.sh

until nc -z database 5432; do
  echo "⏳ Waiting for PostgreSQL at database:5432..."
  sleep 2
done

echo "✅ PostgreSQL is up — starting backend..."
exec "$@"
