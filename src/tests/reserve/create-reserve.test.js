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
		name: "João Paulo Reserva",
		cpf: "050.032.333-33",
		birth: "2004-02-20 03:00:00.000",
		cep: "76400-000",
		email: "joãopauloreserva@gmail.com",
		password: "123456",
	});

	user = { ...res };
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

	const createCar = new CreateCarService();
	const car = await createCar.execute({
		model: "Carro para Reserva",
		color: "white",
		acessories: [{ name: "Ar Condicionado" }],
		numberOfPassengers: 4,
		valuePerDay: 150,
		year: 2023,
	});
	carCreated = { ...car };
});

test("The system should create a reserve", async () => {
	const res = await request(app)
		.post("/v1/reserve")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			startDate: "04/10/2024",
			endDate: "06/10/2024",
			carId: `${carCreated.id}`,
		});

	console.log(res);

	expect(res.statusCode).toBe(201);
});
