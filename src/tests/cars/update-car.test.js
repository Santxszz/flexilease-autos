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
		model: "SHOW CAR",
		color: "gray",
		year: 1999,
		valuePerDay: 15,
		acessories: [{ name: "Acessorios" }],
		numberOfPassengers: 5,
	});

	const res = await createUser.execute({
		name: "User Car Test Update",
		cpf: "000.000.223-13",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userCarShow13@gmail.com",
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

test("The system should update a specific car", async () => {
	const res = await request(app)
		.put(`/v1/car/${car.id}`)
		.set("Authorization", `Bearer ${user.token}`)
        .send({model: "Altered By Unit Test"})

	expect(res.statusCode).toBe(200);
});



test("Model car year have to between 1950 and 2023", async () => {
    const res = await request(app)
		.put(`/v1/car/${car.id}`)
        .set("Authorization", `Bearer ${user.token}`)
		.send({
			year: 1920,
		});

	expect(res.body.message).toBe("The year of vehicle is invalid, must be between 1950-2023!");
})

test("Acessories do not have property different's [acessories: {name: value}]", async () => {
    const res = await request(app)
		.put(`/v1/car/${car.id}`)
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