#!/bin/bash
# reset.sh — Full DB reset: drop everything, re-create, re-seed
# IMPORTANT: Rulează asta după orice modificare la migrations/
# docker compose restart NU re-aplică migrations (doar reset.sh face asta)

set -e

echo "🔄 Resetting BBC database..."
docker compose down -v
docker compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..15}; do
  if docker exec bbc_postgres pg_isready -U bbc_admin -d bbc_chatbot > /dev/null 2>&1; then
    echo "✅ PostgreSQL ready!"
    break
  fi
  echo "   Attempt $i/15..."
  sleep 2
done

echo ""
echo "📊 Connection string:"
echo "   postgresql://bbc_admin:dev_password_123@localhost:5433/bbc_chatbot"
echo ""
echo "🔗 DBeaver / TablePlus connection:"
echo "   Host: localhost | Port: 5433 | DB: bbc_chatbot"
echo "   User: bbc_admin | Password: dev_password_123"
echo ""
echo "✅ Database reset complete. Schema + seed data applied."
