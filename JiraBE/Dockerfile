# ======================
# BUILD STAGE
# ======================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Sadece pom.xml
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/main ./src/main

RUN mvn clean package -Dmaven.test.skip=true

# ======================
# RUNTIME STAGE
# ======================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "--enable-preview", "-jar", "app.jar"]
