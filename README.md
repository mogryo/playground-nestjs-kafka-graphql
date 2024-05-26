# Nest.js + Apache Kafka + GraphQL - Playground
## Description
This is a playground for Nest.js, Apache Kafka and GraphQL.
Test publishing/subscribing with Apache Kafka.

## Installation

```bash
$ yarn install
```

## Running the app

Firstly, launch MongoDB and Apache Kafka. You can do it via Docker.
```bash
# MongoDB
docker pull mongodb/mongodb-community-server:latest
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest

# Apache Kafka
docker pull apache/kafka:3.7.0
docker run --name kafka-apache -p 9092:9092 -d apache/kafka:3.7.0
```

Scripts to run the application.
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
