const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const {
	default: CreateUserService,
} = require("@api/services/Users/CreateUserService");

let user;
beforeAll(async () => {
	const createUser = new CreateUserService();
	const res = await createUser.execute({
		name: "Erek Show",
		cpf: "000.000.001-02",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userShow@gmail.com",
		password: "123456"
	});

	user = { ...res };
	console.log(res);
	console.log(user.id);
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
});

test("The system should show details of specific user", async () => {
	const res2 = await request(app)
		.get(`/v1/user/${user.id}`)
		.set("Authorization", `Bearer ${user.token}`);

	expect(res2.statusCode).toBe(200);
	expect(res2.body).toHaveProperty("name");
});