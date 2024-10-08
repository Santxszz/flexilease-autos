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

    const res = await createUser.execute({
		name: "User Car Test Modify",
		cpf: "000.099.223-13",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userCarShow1323@gmail.com",
		password: "123456",
	});

	user = { ...res };
    const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

	const resCar = await createCar.execute({
		model: "MODIFY CAR",
		color: "blue",
		year: 1999,
		valuePerDay: 15,
		acessories: [{ name: "Acessorios" }],
		numberOfPassengers: 5,
        tokenUser: `Bearer ${user.token}`
	});


	car = { ...resCar };
	
});

test("The system should update a specific car", async () => {
	const res = await request(app)
		.patch(`/v1/car/${car.id}`)
		.set("authorization", `Bearer ${user.token}`)
		.send({
			model: "Altered By Unit Test",
			acessories: [{ name: "Acessório" }],
		});

	expect(res.statusCode).toBe(200);
});

test("Model car year have to between 1950 and 2023", async () => {
	const res = await request(app)
		.patch(`/v1/car/${car.id}`)
		.set("authorization", `Bearer ${user.token}`)
		.send({
			acessories: [{ name: "Teste" }],
			year: 1920,
		});

	expect(res.body.message).toBe(
		"The year of vehicle is invalid, must be between 1950-2023!");
});

test("Acessories fild is required", async () => {
	const res = await request(app)
		.patch(`/v1/car/${car.id}`)
		.set("authorization", `Bearer ${user.token}`)
		.send({
			model: "GM S10 2.8",
			color: "white",
			year: 1920,
			valuePerDay: 50,
			numberOfPassengers: 5,
		});

	expect(res.body.message).toBe("Validation failed");
});

test("Acessories do not have property different's [acessories: {name: value}]", async () => {
	const res = await request(app)
    .patch(`/v1/car/${car.id}`)
		.set("authorization", `Bearer ${user.token}`)
		.send({
			acessories: [{ "name": "A" }, { "acessorio": "123" }]
		});
    console.log(res.body)
	expect(res.body.message).toBe("The acessories not accept another syntax! Please use [ acessories: {name: value} ]");
});
