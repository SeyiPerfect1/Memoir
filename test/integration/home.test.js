const request = require('supertest')
const app = require('../../app');


describe('GET "/", - Home Route', () => {
    it('Should return WELCOME HOME', async () => {
        const response = await request(app).get('/').set('content-type', 'application/json')
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "welcome home"})
    })

    it('Should return NO PAGE FOUND when routed to undefined route', async () => {
        const response = await request(app).get('/undefined').set('content-type', 'application/json')
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ message: "No page found, check url!!!" })
    })
});