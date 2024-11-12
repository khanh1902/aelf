./gradlew bootJar && docker-compose -f ./docker-compose.yml build --no-cache

docker push registry.gitlab.com/suga-marketplace/marketplace-service

docker rm --force marketplace

docker run --env-file .env.example --name marketplace --restart=always -p 8080:8080 registry.gitlab.com/suga-marketplace/marketplace-service

docker run --env-file .env.debug --name marketplace --restart=always -p 8080:8080 registry.gitlab.com/suga-marketplace/marketplace-service

docker run --name marketplace --restart=always -p 8080:8080 registry.gitlab.com/suga-marketplace/marketplace-service

docker run -it --restart=always -p 8080:8080 registry.gitlab.com/suga-marketplace/marketplace-service /bin/bash

docker run -it --restart=always -p 8080:8080 registry.gitlab.com/suga-marketplace/marketplace-service /bin/cat /app/boot.sh
