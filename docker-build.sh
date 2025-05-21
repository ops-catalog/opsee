#!/bin/bash

# Build the Docker image
docker build -t opsee-catalog-ui .

# Run the container with the catalog URL from environment or default
docker run -p 3000:3000 \
  -e CATALOG_URL=${CATALOG_URL:-http://localhost:8080/api/catalog} \
  --name opsee-catalog-ui \
  opsee-catalog-ui 