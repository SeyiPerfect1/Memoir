# Memoir <br>
As part of [AltschoolAfrica](https://altschoolafrica.com) second semester examination, this is an api for a **Bloging app**. <hr>

## Requirements <br>
 1. User should be able to register
 2. User should be able to login with Passport using JWT
 3. Implement basic auth
 4. User should be able to get orders
 5. Users should be able to create orders
 6. Users should be able to update and delete orders
 7. Test application  <hr/>
## Setup <br>
 * Install NodeJS, MongoDB
 * pull this repo
 * update env with example.env
 * run npm run start <hr>
## Base URL
 * [Link to api]() <hr>
## Models <br>
### users
| field	| data_type	| constraints | validation |
| -------- | ---------| -----------| ----------------------|
| id | Object | required | None |
| username | string	| required | unique |
| firstname |	string | required | unique |
| lastname |	string | required | unique |
| email |	string | required | unique, email must conform to email (example: user1@gmail.com) |
| password |	string | required | pasword must contain at least one uppercase, one lowercase, one symbol, and must be at least 8 |
| intro | string | optional | None |
| urlToImage | string | optional | None |
| posts | array | got saved automatically when a new post is created | None | <br>
### posts
| field	| data_type	| constraints | validation |
| -------- | ---------| -----------| ----------------------|
| id | Object | required | None |
| author | object	| get saved automatically when a new post is created | None |
| description |	string | optional | unique |
| tags |	array | optional | None |
| body |	string | required | None |
| readCount |	Number | increament automaticaly by 1 when the post is queried, default: 0  | None |
| readTime |	Number | got saved automatically when new post is created | None |
| state | string | required, default: state | enum: ["state, "published"] |
| publishedAt | Date | got saved when post state is updated | None |
| slug | string | got save by concatenating | None | <hr>
## APIs <br>
### Signup User <br> 
 * Route: /signup
 * Method: POST
 * Body:
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
  "username": 'jon_doe",
}
* Responses
  Success

{
    message: 'Signup successful',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "firstname": "jon",
        "lastname": "doe",
        "username": 'jon_doe",
        "posts": []
     }
}
Login User
Route: /login
Method: POST
Body:
{
  "password": "Password1",
  "username": 'jon_doe",
}
Responses
Success

{
    message: 'Login successful',
    token: 'sjlkafjkldsfjsd'
}
Create Order
Route: /orders
Method: POST
Header
Authorization: Bearer {token}
Body:
{
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
Responses
Success

{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
Get Order
Route: /orders/:id
Method: GET
Header
Authorization: Bearer {token}
Responses
Success

{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
Get Orders
Route: /orders
Method: GET
Header:
Authorization: Bearer {token}
Query params:
page (default: 1)
per_page (default: 10)
order_by (default: created_at)
order (options: asc | desc, default: desc)
state
created_at
Responses
Success

{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
...

Contributor
Daniel Adesoji
