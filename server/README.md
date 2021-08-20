# Temporal API Docs

### Local Development Base URL

---

- `http://localhost:8080/api`

### Remote Production Base URL

---

- `http://ec2-15-165-76-37.ap-northeast-2.compute.amazonaws.com/api`

### External API Base URL

---

- `https://api.upbit.com/v1`

### Common Responses

---

- Success Code: 200 OR 201

- Content: JSON Data OR Success Message

<br>

- Error Code: 400 OR 401 OR 404

- Content: Error Code AND Error Message

### Authentication

---

#### Sign up(userId, password)

- URL

  /auth/signup

- Method

  `POST`

#### Login(userId, password)

- URL

  /auth/login

- Method

  `POST`

#### Social Authentication(google, facebook(later))

- URL

  /auth/google

- Method

  `GET`

### Public Users, User

---

#### Get Users

- URL

  /users

- Method

  `GET`

#### Get User

- URL

  /users/:userId

- Method

  `GET`

### Private User

---

#### Get, Update, Delete User

- URL

  /user

- Method

  `GET`

  `PUT`

  `DELETE`

- Headers

  `Authorization: Bearer ${Token}`

#### Update User Image

- URL

  /user/image

- Method

  `PUT`

- Headers

  `Authorization: Bearer ${Token}`

#### Follow User

- URL

  /user/follow

- Method

  `PUT`

- Headers

  `Authorization: Bearer ${Token}`

#### UnFollow User

- URL

  /user/unfollow

- Method

  `PUT`

- Headers

  `Authorization: Bearer ${Token}`

### Coins

---

#### Get Coins

- URL

  /coins

- Method

  `GET`

#### Get Coin

- URL

  /coins/:coinId

- Method

  `GET`

### Posts

---

#### Get Posts

- URL

  /:coinId/posts

- Method

  `GET`

#### Get Post

- URL

  /:coinId/posts/:postId

- Method

  `GET`

#### Update, Delete Post

- URL

  /:coinId/posts/:postId

- Method

  `PUT`

  `DELETE`

- Headers

  `Authorization: Bearer ${Token}`

#### Create Post

- URL

  /:coinId/post

- Method

  `POST`

- Headers

  `Authorization: Bearer ${Token}`

### Admin

---

#### Create Coin

- URL

  /admin/coin

- Method

  `POST`

- Headers

  `Authorization: Bearer ${Admin Token}`

#### Update Coin

- URL

  /admin/coins/:coinId

- Method

  `PUT`

- Headers

  `Authorization: Bearer ${Admin Token}`
