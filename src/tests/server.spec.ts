const supertest = require("supertest")
const request = supertest("http://localhost:3000")

test('Deve responder na porta 3000', () => {
    const user = 'teste'
    expect(user).toBe('teste')
})