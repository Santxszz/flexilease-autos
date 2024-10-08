const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const {
	default: CreateUserService,
} = require("@api/services/Users/CreateUserService");

beforeAll(async () => {
	const createUser = new CreateUserService();

	const res = await createUser.execute({
		name: "User Car Test List",
		cpf: "000.000.223-44",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userCarLis1t@gmail.com",
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

test("The system should list all cars", async () => {
	const res = await request(app)
		.get("/v1/car")
		.set("authorization", `Bearer ${user.token}`);

	expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("car");
});


test("If have query params like page and limit", async () => {
	const res = await request(app)
		.get("/v1/car")
		.set("authorization", `Bearer ${user.token}`)
        .set("page", 2)
        .set("limit", 10)

	expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("offset");
});

test("If have query params like model or color", async () => {
	const res = await request(app)
		.get("/v1/car")
		.set("authorization", `Bearer ${user.token}`)
        .set("color", "white")
        .set("model", "GM S10 2.8 List")

	expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("offset");
});