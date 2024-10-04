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
	const createCar = new CreateCarService();

	const resCar = await createCar.execute({
		model: "GM S10 2.8",
		color: "white",
		year: 2020,
		valuePerDay: 50,
		acessories: [{ name: "Acessorios" }],
		numberOfPassengers: 5,
	});

	const res = await createUser.execute({
		name: "User Car Test Delete",
		cpf: "000.000.333-44",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userCarTestDelete@gmail.com",
		password: "123456",
	});

	user = { ...res };
	car = { ...resCar };
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
});

test("The system should delete a car", async () => {
	const res = await request(app)
		.delete(`/v1/car/${car.id}`)
		.set("Authorization", `Bearer ${user.token}`);

	expect(res.statusCode).toBe(204);
});

test("If not found car, return error", async () => {
    const res = await request(app)
		.delete("/v1/car/99999")
		.set("Authorization", `Bearer ${user.token}`);

	expect(res.body.message).toBe("Car is not found.");
})