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
 ```
 {
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
  "username": 'jon_doe",
 }
 ```
 * Responses: Success
  ```
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
  ```
### Login User
 * Route: /login
 * Method: POST
 * Body:
 ```
 {
   "password": "Password1",
   "email": 'doe@example.com",
 }
 ```
 * Responses: Success
 ```
 {
   "token": "exampletoken&8ofiwhb.fburu276r4ufhwu4.o82uy3rjlfwebj",
 }
 ```
 ### Home Page
 * Route: /
 * Method: GET
 * Header
   - Authorization: None
 * Responses: Success
 ```
 {
   "message": "Welcome home",
 }
 ```
### Create Post
 * Route: /orders
 * Method: POST
 * Header
   - Authorization: Bearer {token}
 * Body:
 ```
 {
   "title": "Lorem Ipsum",
   "description": "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
   "body": "What is Lorem Ipsum?
           Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,    when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
   "tags" "Children, Education, Sport"
 }
 ```
 * Responses: Success
 ```
 {
   "message": "post created successfully",
   "title": "Lorem Ipsum",
   "slug": "Lorem-Ipsum-6f5ejfjr8hfhrurfurfh83"
 }
 ```
### Get post     
 *//returns only published post*
 * Route: /posts/:slug        
 * Method: GET
 * Header
   - Authorization: None
 * Responses: Success(if slug match post) 
 ```
 {
   "message": {
        "author": {
            "firstname": "jon",
            "lastname": "doe",
            "username": "jon_doe",
            "email": "jondoe@mail.com",
        },
        "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "tags": [
            "Anker56",
            "Travel",
            "Photography"
        ],
        "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis el
        "readCount": 1,
        "readingTime": 5,
        "state": "published",
        "description": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "slug": "ea-molestias-quasi-exercitationem-repellat-qui-ipsa-sit-aut-636718b62bf8c8fa24517068"
    }
 }
 ```
  * Responses: Not Found
 ```
 {
   "message": "post not found"
 }
 ```
### Get Posts     
 *//returns only published posts*
 * Route: /posts
 * Method: GET
 * Header:
   - Authorization: None
 * Query params:
   - author = "jon_doe"  *//query with username*
   - title = "lorem ipsum"  *//query post titles and matches any post that has lorem ipsum in its title*
   - tags  *//eg tags=Children+Sports+Fitness*
   - start date  *//start=2022/11/01,end=2022/11/05*
 * order_by(sort): 
   - default(publishedAt: desc}  
   - readCount
   - readingTime
 * page = (default: 1) *//can select any e.g page = 3*
 * limit = (default: 20) *//can limit to any value e.g limit = 5*
 * *// example url:  http://localhost:4000/author=john_doe&tags=Children+Sports+Fitness&title=Lorem+ipsum&order_by=publishedAt+desc,readCount+asc,readingTime+desc*
 * Responses: Success
 ```
 {
   "message": {
        "author": {
            "firstname": "jon",
            "lastname": "doe",
            "username": "jon_doe",
            "email": "jondoe@mail.com",
        },
        "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "tags": [
            "Anker56",
            "Travel",
            "Photography"
        ],
        "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut et iusto sed quo iure\nvoluptatem occaecati omnis el
        "readCount": 1,
        "readingTime": 5,
        "state": "published",
        "description": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "slug": "ea-molestias-quasi-exercitationem-repellat-qui-ipsa-sit-aut-636718b62bf8c8fa24517068"
    }
 }......
 ```
 ### Update Post
 *// updates the state of the blog from draft to published or uodate post many contents
 * Route: /post/:slug
 * Method: PUT
 * Header
   - Authorization: Bearer {token}
 * Body:
 ```
 { 
   "state" "publushed"
   *//or update other post metadata at the same time*
   "title": "Lorem Ipsum",
   "description": "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
   "body": "What is Lorem Ipsum?
           Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,    when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
   "tags" "Children, Education, Sport"
 }
 ```
 * Responses: Success
 ```
 {
   "message": "post updated successfully",
 }
 ```
### Update Post
 * Route: /post/:slug
 * Method: DELETE
 * Header
   - Authorization: Bearer {token}
 * Responses: Success
 ```
 {
   "message": "post deleted successfully",
 }
 ```
 ### Get User Post(s) and Details
 *//shows only published posts of req.user!=logged in user*
 *//shows both published and dradt posts if req.user === logged in user*
 * Route: /:username
 * Method: GET
 * Header
   - Authorization: Bearer {token}
 * Responses: Success
 ```
 {
    "message": "user1 has 2 post(s)",
    "post": [
        {
            "_id": "636718b62bf8c8fa24517067",
            "author": {
                "_id": "6367116e679244141511f084",
                "firstname": "userA",
                "lastname": "userZ",
                "username": "user1",
                "email": "user1@mail.com",
                "password": "Password0!",
                "createdAt": 1667700918841,
                "updatedAt": 1667700918841
            },
            "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            "tags": [
                "Anker60",
                "Soundcore60"
            ],
            "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et 
            "readCount": 0,
            "readingTime": 7,
            "state": "published",
            "publishedAt": "2022-11-06T02:15:18.841Z",
            "createdAt": "2022-11-06T02:15:18.841Z",
            "__v": 0,
            "updatedAt": "2022-11-06T02:15:18.981Z",
            "description": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            "slug": "sunt-aut-facere-repellat-provident-occaecati-excepturi-optio-reprehenderit-636718b62bf8c8fa24517067"
        },
        {
            "_id": "636718b62bf8c8fa24517069",
            "author": {
                "_id": "6367116e679244141511f084",
                "firstname": "userA",
                "lastname": "userZ",
                "username": "user1",
                "email": "user1@mail.com",
                "password": "Password0!",
                "createdAt": 1667700918841,
                "updatedAt": 1667700918841
            },
            "title": "This is our time. it has arrived",
            "tags": [
                "Family",
                "Health"
            ],
            "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem adipisci\nsit amet autem ullam et saepe reiciendis voluptatem 
            "readCount": 2,
            "readingTime": 6,
            "state": "draft",
            "createdAt": "2022-11-06T02:15:18.841Z",
            "__v": 0,
            "updatedAt": "2022-11-06T02:15:18.984Z",
            "description": "eum et est occaecati",
            "slug": "eum-et-est-occaecati-636718b62bf8c8fa24517069"
        },
 ```
 ### Update User
 */allows users to update their profiles(req.user.email must equal profile.email)*
 * Route: /update-profile
 * Method: UPDATE
 * Header
   - Authorization: Bearer {token}
 * Responses: Success
 ```
 {
   "message": "user details updated successfully",
 }
 ```
  ### Delete User
 */allows users to delete their profiles(req.user.email must equal profile.email)*
 * Route: /delete-user
 * Method: DELETE
 * Header
   - Authorization: Bearer {token}
 * Responses: Success
 ```
 {
   "message": "user deleted successfully",
 }
 ```
   ### Change Password
 */allows users change their password(req.user.email must equal profile.email)*
 * Route: /change-profile
 * Method: PUT
 * Header
   - Authorization: Bearer {token}
 * Responses: Success
 ```
 {
   "message": "password changed successfully",
 }
 ```
 
...

Contributor
Oluseyi Adeegbe
