// const request = require("supertest");
// const app = require("../../index");
// const jwt = require("jsonwebtoken");
// const {
// 	default: CreateUserService,
// } = require("@api/services/Users/CreateUserService");
// const {
// 	default: CreateCarService,
// } = require("@api/services/Cars/CreateCarService");
// const { default: CreateReserveService } = require("@api/services/Reserves/CreateReserveService");

// beforeAll(async () => {
// 	const createUser = new CreateUserService();
// 	const res = await createUser.execute({
// 		name: "João Pedro Deleta",
// 		cpf: "051.032.133-33",
// 		birth: "2004-02-20 03:00:00.000",
// 		cep: "76400-000",
// 		email: "joãopausloreserva23@gmail.com",
// 		password: "123456",
// 	});

//     const res2 = await createUser.execute({
// 		name: "Pedrinho Pulos Delete",
// 		cpf: "242.032.943-33",
// 		birth: "2020-02-20 03:00:00.000",
// 		cep: "76400-000",
// 		email: "pedrinhozpulos@gmail.com",
// 		password: "123456",
// 	});

// 	user = { ...res };
// 	user2 = { ...res2 };
// 	const jwtPayload = {
// 		userId: user.id,
// 		name: user.name,
// 		email: user.email,
// 	};
//     const jwtPayload2 = {
// 		userId: user2.id,
// 		name: user2.name,
// 		email: user2.email,
// 	};
// 	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
//     user2.token = jwt.sign(jwtPayload2, process.env.JWT_SECRET);

// 	const createCar = new CreateCarService();
// 	const car = await createCar.execute({
// 		model: "Carro para Reserva",
// 		color: "white",
// 		acessories: [{ name: "Ar Condicionado" }],
// 		numberOfPassengers: 4,
// 		valuePerDay: 150,
// 		year: 2023,
//         tokenUser: `Bearer ${user.token}`
// 	});
//     const car2 = await createCar.execute({
// 		model: "Carro Maneiro",
// 		color: "white",
// 		acessories: [{ name: "Ar Condicionado" }],
// 		numberOfPassengers: 4,
// 		valuePerDay: 150,
// 		year: 2023,
//         tokenUser: `Bearer ${user2.token}`
// 	});


// 	carCreated = { ...car };
//     carCreated2 = {...car2}
//     console.log(carCreated)

//     // const reserveService = new CreateReserveService()
//     // const reserve = await reserveService.execute({carId: Number(carCreated.id), endDate: "25/03/2024", startDate: "25/02/2024", tokenUser: `Bearer ${user.token}`, finalValue: 10, userId: Number(user.id)})
    
//     // reserved = {...reserve}
//     // console.log(reserved)

// });

// test("The system should delete a reserve", async () => {
// 	const res = await request(app)
// 		.delete(`/v1/reserve/${reserved.id}`)
// 		.set("Authorization", `Bearer ${user.token}`)
// 	expect(res.statusCode).toBe(204);
// });