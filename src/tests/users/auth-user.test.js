const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const {
	default: CreateUserService,
} = require("@api/services/Users/CreateUserService");

beforeAll(async () => {
	const createUser = new CreateUserService();
	const res = await createUser.execute({
		name: "Erek",
		cpf: "123.000.000-12",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "zzzzzz@gmail.com",
		password: "123456",
	});
});

test("The system should auth a user", async () => {
	const res2 = await request(app)
		.post("/v1/auth")
        .send({email: "zzzzzz@gmail.com", password: "123456"})

	expect(res2.statusCode).toBe(200);
	expect(res2.body).toHaveProperty("acessToken");
});
