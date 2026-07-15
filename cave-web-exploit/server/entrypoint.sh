#!/bin/sh

echo "nge seed table sekalian bikin db dulu lah biar ada tabelnya cuk"
seed_table
echo "nge seed data di table nya cuy"
seed_data

exec "$@"