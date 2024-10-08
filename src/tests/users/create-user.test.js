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
		cpf: "000.000.000-01",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "erekcoutosantosZ@gmail.com",
		password: "123456",
	});
});

test("The system should create a user", async () => {
	const res = await request(app)
		.post("/v1/user")
		.send({
			name: "Erek Couto Santos",
			cpf: "011.232.123-01",
			birth: "20/02/2004",
			cep: "76400-000",
			email: `${Date.now()}@gmail.com`,
			password: `${Date.now()}`,
		});

	expect(res.statusCode).toBe(201);
});

test("The system must not accept passwords shorter than 6 characters.", async () => {
	const res = await request(app)
		.post("/v1/user")
		.send({
			name: "Erek",
			cpf: "111.232.123-01",
			birth: "03/03/2004",
			cep: "76400-000",
			email: `${Date.now()}@gmail.com`,
			password: "123",
		});

	expect(res.body.message).toBe(
		"The password must be longer than 6 characters.",
	);
});

test("The system must be return error if cep is invalid", async () => {
    const res = await request(app)
		.post("/v1/user")
		.send({
			name: "Erek Cosuto Santos",
			cpf: "011.232.713-01",
			birth: "20/02/2004",
			cep: "sadwadsadwadsadwd",
			email: "testandooCep@gmail.com",
			password: `${Date.now()}`,
		});

	expect(res.body.message).toBe("Cep is invalid.");
})

test("The system must not accept duplicated email", async () => {
	const res = await request(app)
		.post("/v1/user")
		.send({
			name: "Erek Couto Santos",
			cpf: "042.232.123-01",
			birth: "20/02/2004",
			cep: "76400-000",
			email: "erekcoutosantosZ@gmail.com",
			password: `${Date.now()}`,
		});

	expect(res.body.message).toBe("The email or cpf already in use.");
});

test("The system must be not accept dulicated cpf", async () => {
	const res = await request(app)
		.post("/v1/user")
		.send({
			name: "Erek",
			cpf: "000.000.000-01",
			birth: "03/03/2004",
			cep: "76400-000",
			email: "erekcoutosantos22@gmail.com",
			password: `${Date.now()}`,
		});

	expect(res.body.message).toBe("The email or cpf already in use.");
});

test("The system should verify the name of user, cannot have numbers", async () => {
	const res = await request(app)
		.post("/v1/user")
		.send({
			name: "Erek223131231231231231",
			cpf: "011.232.193-01",
			birth: "03/03/2004",
			cep: "76400-000",
			email: `${Date.now()}@gmail.com`,
			password: "123456",
		});

	expect(res.body.message).toBe("Name is invalid remove the numbers.");
});