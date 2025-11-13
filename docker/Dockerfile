FROM amazoncorretto:20 AS build
WORKDIR /app

COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
COPY Domain Domain
COPY Application Application
COPY Infrastructure Infrastructure
COPY API API

RUN chmod +x gradlew
RUN ./gradlew :API:bootJar -x test

FROM amazoncorretto:20 AS runtime
WORKDIR /app

COPY --from=build /app/API/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]