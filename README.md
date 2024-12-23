# Video Mangement Portal

There is two files `app.js` and a database file  consisting of two Collection `Registeruser`, `Videoupload`.

Write APIs to perform operations on the  `Registeruser`, `Videoupload` only after authentication of the user.

The columns of the tables are given below,

**Register Table**

| Columns    | Type    |
| ---------- | ------- |
| email      | TEXT    |
| username   | TEXT    |
| password   | TEXT    |

**Videos  Table**

| Columns       | Type    |
| ------------- | ------- |
| user          | TEXT    |
| title         | TEXT    |
| description   | TEXT    |
| tags          | TEXT    |
| videoUrl      | TEXT    |


You can use your previous code if required.

#### Sample Valid User Credentials

```
{
  "email": "christopher@gmail.com",
  "password": "christy@123"
}
```

### API 1

#### Path: `/login/`

#### Method: `POST`

**Request**

```
{
  "email": "christopher@gmail.com",
  "password": "christy@123"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides an incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**

    Return the JWT Token

    ```
    {
      "jwtToken": "ak2284ns8Di32......"
    }
    ```

### Authentication with Token

- **Scenario 1**

  - **Description**:

    If the token is not provided by the user or an invalid token

  - **Response**
    - **Status code**
      ```
      401
      ```
    - **Body**
      ```
      Invalid JWT Token
      ```

- **Scenario 2**
  After successful verification of token proceed to next middleware or handler

### API 2

#### Path: `/video/:user`

#### Method: `GET`

#### Description:

Returns a list of Video  Based on User email id 

#### Response

```
[
    {
        "_id": "6768d1b41fb4f84c1e0b89c2",
        "user": "vinay@gmail.com",
        "title": "Zeero to one ",
        "description": "Making money",
        "tags": "#happy #good",
        "videoUrl": "https://youtu.be/CdMo9iS6SlI?si=V8rAK4JRpMUwgOe-",
        "date": "2024-12-23T02:57:56.746Z",
        "__v": 0
    }
]
```

### API 3

#### Path: `/videobyid/:id/`

#### Method: `GET`

#### Description:

Returns a videos  based on the video ID

#### Response

```
    {
        "_id": "6768d1b41fb4f84c1e0b89c2",
        "user": "vinay@gmail.com",
        "title": "Zeero to one ",
        "description": "Making money",
        "tags": "#happy #good",
        "videoUrl": "https://youtu.be/CdMo9iS6SlI?si=V8rAK4JRpMUwgOe-",
        "date": "2024-12-23T02:57:56.746Z",
        "__v": 0
    }


```

### API 4

#### Path: `/videobyid/:id/`

#### Method: `DELETE`

#### Description:

Deletes a video from the Video  table based on the ID

#### Response

```
Video  Removed

```



<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
