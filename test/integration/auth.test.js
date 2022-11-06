const request = require('supertest');
const { connect } = require('./db.memory');
const UserModel = require('../../src/models/user.models');
const app = require('../../app');
const user = require("../fixtures/users")

describe('POST: Signup and Login', () => {
    it('should signup a user', async () => {
        const response = await request(app).post('/accounts/signup')
        .set('content-type', 'application/json')
        .send({
            username: user[0].username,
            firstname: user[0].firstName,
            lastname: user[0].lastName,
            password: user[0].password,
            email: user[0].email
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('username', 'user1')
        expect(response.body.user).toHaveProperty('firstname', 'user')
        expect(response.body.user).toHaveProperty('lastname', 'user')
        expect(response.body.user).toHaveProperty('email', 'user1@mail.com')        
    })


    it('should login a user', async () => {
        // create user in out db
        const user = await User.create({ email: user[0].email, password: user[0].password});

        // login user
        const response = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: user1[0].username, 
            password: user1[0].password
        });
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')      
    })
})