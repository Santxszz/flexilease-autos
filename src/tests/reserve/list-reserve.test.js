const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const {
	default: CreateUserService,
} = require("@api/services/Users/CreateUserService");
const {
	default: CreateCarService,
} = require("@api/services/Cars/CreateCarService");

beforeAll(async () => {
	const createUser = new CreateUserService();
	const res = await createUser.execute({
		name: "João Pedro Reserva",
		cpf: "051.032.333-33",
		birth: "2004-02-20 03:00:00.000",
		cep: "76400-000",
		email: "joãopauloreserva23@gmail.com",
		password: "123456",
	});

    const res2 = await createUser.execute({
		name: "Pedrinho Pulos",
		cpf: "242.032.333-33",
		birth: "2020-02-20 03:00:00.000",
		cep: "76400-000",
		email: "pedrinhopulos@gmail.com",
		password: "123456",
	});

	user = { ...res };
	user2 = { ...res2 };
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
    const jwtPayload2 = {
		userId: user2.id,
		name: user2.name,
		email: user2.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
    user2.token = jwt.sign(jwtPayload2, process.env.JWT_SECRET);

	const createCar = new CreateCarService();
	const car = await createCar.execute({
		model: "Carro para Reserva",
		color: "white",
		acessories: [{ name: "Ar Condicionado" }],
		numberOfPassengers: 4,
		valuePerDay: 150,
		year: 2023,
        tokenUser: `Bearer ${user.token}`
	});
    const car2 = await createCar.execute({
		model: "Carro Maneiro",
		color: "white",
		acessories: [{ name: "Ar Condicionado" }],
		numberOfPassengers: 4,
		valuePerDay: 150,
		year: 2023,
        tokenUser: `Bearer ${user.token}`
	});


	carCreated = { ...car };
    carCreated2 = {...car2}
});

test("The system should list reserves of an user", async () => {
	const res = await request(app)
		.get("/v1/reserve")
		.set("Authorization", `Bearer ${user.token}`)

	expect(res.statusCode).toBe(200);
});

test("The system should return error if user not exists", async () => {
    const res = await request(app)
		.get("/v1/reserve")
		.set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIm5hbWUiOiJFcmVrIiwiZW1haWwiOiJlcmVrY291dG9zYW50b3NAZ21haWwuY29tIiwiaWF0IjoxNzI4MzYwOTgxLCJleHAiOjE3Mjg0MDQxODF9.khW8LAQm4HHTuzmihI314TV1h5Dn3n4glEUMTZ_9KuE")

	expect(res.statusCode).toBe(404);
})
