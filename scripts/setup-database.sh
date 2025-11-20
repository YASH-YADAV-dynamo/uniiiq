#!/bin/bash

# Setup Database Script
# This script runs the schema.sql file in Supabase

echo "Setting up database schema..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    echo "Please install Supabase CLI: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if connected to Supabase project
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "Please set SUPABASE_DB_URL environment variable"
    echo "Or run: supabase link --project-ref your-project-ref"
    exit 1
fi

# Run the schema file
echo "Running schema.sql..."
supabase db execute --file supabase/schema.sql

echo "Database setup complete!"

