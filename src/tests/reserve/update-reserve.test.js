const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const {
	default: CreateUserService,
} = require("@api/services/Users/CreateUserService");
const {
	default: CreateCarService,
} = require("@api/services/Cars/CreateCarService");
const { default: CreateReserveService } = require("@api/services/Reserves/CreateReserveService");
const dayjs = require("dayjs");

beforeAll(async () => {
	const createUser = new CreateUserService();
	const res = await createUser.execute({
		name: "João Pedro Deleta",
		cpf: "157.032.133-33",
		birth: "2004-02-20 03:00:00.000",
		cep: "76400-000",
		email: "joãopazuszaloreserva23@gmail.com",
		password: "123456",
	});

    const res2 = await createUser.execute({
		name: "Pedrinho Pulos Delete",
		cpf: "232.552.943-33",
		birth: "2001-02-20 03:00:00.000",
		cep: "76400-000",
		email: "pedrinhozsasspulos@gmail.com",
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
        tokenUser: `Bearer ${user2.token}`
	});


	carCreated = { ...car };
    carCreated2 = {...car2}
    console.log(carCreated)

    const reserveService = new CreateReserveService()

    const reserve = await reserveService.execute({carId: Number(carCreated.id), endDate: "2026-11-06 03:00:00", startDate: "2026-11-04 03:00:00", tokenUser: `Bearer ${user.token}`})
    const reserve2 = await reserveService.execute({carId: Number(carCreated.id), endDate: "2026-11-06 03:00:00", startDate: "2026-11-04 03:00:00", tokenUser: `Bearer ${user2.token}`})
    
    reserved = {...reserve}
    console.log(reserved)

});

test("The system should update a reserve", async () => {
	const res = await request(app)
		.put(`/v1/reserve/${reserved.id}`)
        .send({
			startDate: "04/10/2030",
			endDate: "06/10/2030",
			carId: `${carCreated2.id}`,
		})
		.set("Authorization", `Bearer ${user.token}`)
	expect(res.statusCode).toBe(200);
});

test("The system should return error if users different of a user create reserve", async () => {
	const res = await request(app)
		.put(`/v1/reserve/${reserved.id}`)
        .send({
			startDate: "04/10/2030",
			endDate: "06/10/2030",
			carId: `${carCreated2.id}`,
		})
		.set("Authorization", `Bearer ${user2.token}`)
	expect(res.statusCode).toBe(401);
});

test("The system should return error if car not found", async () => {
	const res = await request(app)
		.put(`/v1/reserve/${reserved.id}`)
        .send({
			startDate: "04/10/2030",
			endDate: "06/10/2030",
			carId: "99999",
		})
		.set("Authorization", `Bearer ${user.token}`)
	expect(res.statusCode).toBe(404);
});