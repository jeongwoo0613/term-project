# Temporal Project Docs

## Introduction

This project is developing on the topic of Cryptocurrency Forum. Cryptocurrency market price is using South Korea's top exchange Upbit Market API.

## Getting Started

### Prerequisites

- npm v7.24.0

- node.js v16.10.0

- mysql v8.0.26

### Installation

```
git clone https://github.com/jeongwoo0613/term-project

<!-- client -->
cd term-project/client - move project client folder

npm i - install dependency

npm start - open browser and running port on 3000

<!-- server -->
cd term-project/server - move project server folder

npm i - install dependency

make .env file and set .env file

npm run dev - running port on 8080
```

### Local API Development Base URL

- `http://localhost:8080/api`

### Remote API Production Base URL

- `http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api`

### External API Base URL

- `https://api.upbit.com/v1`

### Common Responses

- Success Code: 200 OR 201

- Content: JSON Data OR Success Message

<br>

- Error Code: 400 OR 401 OR 404 OR 500

- Content: Error Code AND Error Message

## Flow

![flow](https://user-images.githubusercontent.com/46841257/132828091-4e2531d5-d733-4f1b-b386-c7eda964a785.png)

## Project Main Stack

- Client

  - React
  - React Router

- Server
  - TypeScript
  - Node
  - Express
  - MySQL
  - TypeORM
  - AWS
    - EC2
    - RDS
    - S3

## Contributing

if u give issue, code, function, structure, feedback, etc. for project, I'm really appreciate.
