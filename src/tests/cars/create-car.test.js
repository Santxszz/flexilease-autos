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
		name: "User Car Test",
		cpf: "000.000.333-33",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userCarTest@gmail.com",
		password: "123456",
	});

	user = { ...res };
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
});

test("The system should create a car", async () => {
	const res = await request(app)
		.post("/v1/car")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			model: "GM S10 2.8",
			color: "white",
			year: 2020,
			valuePerDay: 50,
			acessories: [
				{
					name: "Air conditioner 222",
				},
				{
					name: "Air conditioner asd",
				},
				{
					name: "4 ports 2",
				},
				{
					name: "Multmidia 3",
				},
			],
			numberOfPassengers: 5,
		});

	expect(res.statusCode).toBe(201);
});

test("Should have at least one acessorie", async () => {
	const res = await request(app)
		.post("/v1/car")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			model: "GM S10 2.8",
			color: "white",
			year: 2020,
			valuePerDay: 50,
			acessories: [],
			numberOfPassengers: 5,
		});

	expect(res.body.message).toBe("Requires at least one accessory!");
});

test("Model car year have to between 1950 and 2023", async () => {
	const res = await request(app)
		.post("/v1/car")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			model: "GM S10 2.8",
			color: "white",
			year: 1920,
			valuePerDay: 50,
			acessories: [{ name: "A" }],
			numberOfPassengers: 5,
		});

	expect(res.body.message).toBe(
		"The year of vehicle is invalid, must be between 1950-2023!",
	);
});

test("Acessories do not have property different's [acessories: {name: value}]", async () => {
    const res = await request(app)
		.post("/v1/car")
		.set("Authorization", `Bearer ${user.token}`)
		.send({
			model: "GM S10 2.8",
			color: "white",
			year: 1920,
			valuePerDay: 50,
			acessories: [{ name: "A" }, {acessorio: "123"}],
			numberOfPassengers: 5,
		});

	expect(res.body.message).toBe(
		"The acessories not accept another syntax! Please use [ acessories: {name: value} ]",
	);
})