<p align="center">
  <img src="./public/logo.svg" width="200" alt="EduRPA Logo" />
</p>

## Description

EduRPA is a platform for creating and sharing RPA workflows. It is built on top of [Nest](https://docs.nestjs.com/) framework.

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

## API Documentation
Swagger API documentation is available at `/api` route.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database migration
Pre-requisite
- Install TypeORM CLI
```bash
$ npm install -g typeorm
```

Steps
1. Update the config/mysql.datasource.ts file with the entity/entities you want to create a migration for.
2. Run the following command to generate a migration file:
```bash
npm run build
typeorm migration:generate -d dist\\config\\mysql.datasource.js migrations/<your_migration_name>
```
3. Run the following command to apply the migration:
```bash
typeorm migration:run -- -d dist\\config\\mysql.datasource.js
```

## Authors
- Nguyen Quang Khanh
- Huynh Dai Vinh
- Nguyen Duc An
