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
		name: "User Car Test Show",
		cpf: "000.000.223-91",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userCarShow@gmail.com",
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
		model: "SHOW CAR",
		color: "gray",
		year: 1999,
		valuePerDay: 15,
		acessories: [{ name: "Acessorios" }],
		numberOfPassengers: 5,
        tokenUser: `Bearer ${user.token}`
	});


	car = { ...resCar };

});

test("The system should show a specific car", async () => {
	const res = await request(app)
		.get(`/v1/car/${car.id}`)
		.set("authorization", `Bearer ${user.token}`);

	expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("model");
    expect(res.body).toHaveProperty("color");
    expect(res.body).toHaveProperty("year");
});