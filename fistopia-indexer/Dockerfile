FROM --platform=linux/amd64 openjdk:22-slim
MAINTAINER Phuoc Chau <phuoccm@suga.vn>

####################################
# ENVIRONMENT VARIABLES
####################################
ENV JAVA_OPTIONS "-Xmx2048m"
ENV AB_OFF true

WORKDIR /app

####################################
# Create boot shell script
####################################
RUN touch /app/boot.sh
RUN echo '#!/usr/bin/env sh' >> /boot.sh
RUN echo 'java $JAVA_OPTIONS -jar /app/application.jar' >> /boot.sh
RUN chmod +x /boot.sh

####################################
# COPY
####################################
COPY ./build/libs/*.jar /app/application.jar

####################################
# ENTRY
####################################
CMD ["/boot.sh"]

HEALTHCHECK --start-period=30s --interval=5s --timeout=5s --retries=100 CMD curl -f --fail --silent http://localhost:8080/actuator/health | grep UP || exit 1
EXPOSE 8080