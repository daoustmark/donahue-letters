#!/bin/sh
echo "Starting server on port ${PORT:-3000}"
exec npx next start -p "${PORT:-3000}" -H 0.0.0.0
