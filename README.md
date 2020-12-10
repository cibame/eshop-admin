# EShop Backend 💳

## Description

Backend service to serve the EShop.

## Dev enviroment

### DB

Project needs a DB. You must install Docker to have a local DB running.

Once Docker is installed you can:

- Start DB with:

```bash
$ docker-compose up
```

- Stop DB with:

```bash
$ docker-compose down
```

If you do not want to see the log from DB add a `-d` flag to the command.

#### DB User

Username: `root`

Password: `root`

### Test Data

To load test data run: `npx fixtures -s -d test/fixtures`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
