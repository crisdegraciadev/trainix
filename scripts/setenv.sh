#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
export $(grep -v '^#' $DIR/../api/.env | xargs)
