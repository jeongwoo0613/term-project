# Temporal Project Docs

## Introduction

This project is developing on the topic of Cryptocurrency Forum. Cryptocurrency market price is using South Korea's top exchange Upbit Market API.

## Getting Started

### Prerequisites

- [node](https://nodejs.org/en/)

- [mysql](https://www.mysql.com/)

- [git](https://git-scm.com/)

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

move project data folder and make coins using images, coins.json(yaml)

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

## Preview
Home             |  Login
:-------------------------:|:-------------------------:
![home](https://user-images.githubusercontent.com/46841257/135561164-486176d0-efc8-4dc7-acce-c3c7e151f60a.png)  |  ![login](https://user-images.githubusercontent.com/46841257/135561175-1e88ea7b-f700-412c-806f-48d39d8fa03b.png)

Google             |  Coin
:-------------------------:|:-------------------------:
![google](https://user-images.githubusercontent.com/46841257/135561184-f169b332-6d85-48f3-b5d7-83a8f4a193ed.png)  |  ![coin](https://user-images.githubusercontent.com/46841257/135561210-8bf715f1-7c36-4742-8440-5c0ac049adf0.png)

Search             |  Profile
:-------------------------:|:-------------------------:
![search](https://user-images.githubusercontent.com/46841257/135562493-da7baebd-bd30-42d9-ac67-f4202d2e6d87.png)  |  ![profile](https://user-images.githubusercontent.com/46841257/135562951-863e4df6-6707-45e9-9bd5-d7f7bdf90a33.png)  

Trends             |  News
:-------------------------:|:-------------------------:
![trends](https://user-images.githubusercontent.com/46841257/135562509-db93afb4-403c-4a49-afb9-ad2e42e44883.png)  |  ![news](https://user-images.githubusercontent.com/46841257/135562519-6fd25072-0498-41f8-acf9-8396efe43cdf.png)

## Project Main Stack

- Client

  - [React](https://reactjs.org/)
  - [React Router](https://reactrouter.com/)
  - 100% [Hooks](https://reactjs.org/docs/hooks-reference.html)

- Server
  - [TypeScript](https://www.typescriptlang.org/)
  - [Node](https://nodejs.org/en/)
  - [Express](https://expressjs.com/)
  - [MySQL](https://www.mysql.com/)
  - [TypeORM](https://typeorm.io/#/)
  - [AWS](https://aws.amazon.com/)
    - EC2
    - RDS
    - S3

## Contributing

if u give issue, code, function, structure, feedback, etc. for project, I'm really appreciate.
