# Ola Click Challenge

This is a challenge to build a simple orders application using Node.js, NestJS, PostgreSQL and Redis.

## Requirements

- Node.js
- Yarn
- Docker
- Docker Compose

## Setup

1. Clone the repository
2. Create a `.env.local` file based on the `.env.example` file

### Run full application with docker

3. Run the following command

```bash
yarn start:docker:local
```

### Or run app locally in watch mode

3. Run the following command to run the database

```bash
yarn start:docker:local:db
```

4. Install dependencies

```bash
yarn install
```

5. Run the following command to run the application

```bash
yarn start:dev:local
```

## Testing

Run the tests using the following command:

```bash
npm run test
```

You can test the endpoints by importing the following file into Postman

```bash
./postman_collection.json
```
