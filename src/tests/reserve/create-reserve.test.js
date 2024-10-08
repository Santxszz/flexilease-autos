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

test("The system should create a reserve", async () => {
	const res = await request(app)
		.post("/v1/reserve")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			startDate: "04/10/2023",
			endDate: "06/10/2030",
			carId: `${carCreated.id}`,
		});



	expect(res.statusCode).toBe(201);
});


test("You must not accept reservations for a replacement car within a certain period.", async () => {
	const res = await request(app)
		.post("/v1/reserve")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			startDate: "04/10/2023",
			endDate: "06/10/2030",
			carId: `${carCreated.id}`,
		});

	expect(res.body.message).toBe("Car reserved or your already have reserves for this period.");
});

test("The user should be qualified for create reserves", async () => {
    const res = await request(app)
		.post("/v1/reserve")
		.set("Authorization", `Bearer ${user2.token}`)
		.send({
			startDate: "04/10/2024",
			endDate: "06/10/2024",
			carId: `${carCreated2.id}`,
		});


	expect(res.body.message).toBe("The user is not qualifed");
})

test("If car is not exists", async () => {
    const res = await request(app)
		.post("/v1/reserve")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			startDate: "04/10/2024",
			endDate: "06/10/2024",
			carId: "99999999",
		});


	expect(res.body.message).toBe("Car is not found.");
})