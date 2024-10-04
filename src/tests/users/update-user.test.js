const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const {
	default: CreateUserService,
} = require("@api/services/Users/CreateUserService");

let user;
let user2;
beforeAll(async () => {
	const createUser = new CreateUserService();
	const res = await createUser.execute({
		name: "Erek Update",
		cpf: "000.320.002-02",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userUpdateLOK@gmail.com",
		password: "123456",
	});

    await createUser.execute({
		name: "Erek Update",
		cpf: "000.000.321-02",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userUpdate2sa2@gmail.com",
		password: "123456",
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

test("The system should update a user", async () => {
	const res2 = await request(app)
		.put(`/v1/user/${user.id}`)
		.set("Authorization", `Bearer ${user.token}`)
        .send({name: "Erikito"})

	expect(res2.statusCode).toBe(200);
	expect(res2.body).toHaveProperty("name");
});

test("The system must return an error if the token's userId is different from the user's id", async () => {
    const res2 = await request(app)
		.put("/v1/user/102")
		.set("Authorization", `Bearer ${user.token}`)
        .send({name: "Erikito"})

	expect(res2.statusCode).toBe(401);
	expect(res2.body.message).toBe("Not Authorized.")
})

test("The system must not accept duplicated email.", async () => {
    const res2 = await request(app)
    .put(`/v1/user/${user.id}`)
		.set("Authorization", `Bearer ${user.token}`)
        .send({email: "userUpdate2sa2@gmail.com"})

	expect(res2.body.message).toBe("The email already in use.");
})

test("The system must not accept duplicated cpf.", async () => {
    const res2 = await request(app)
    .put(`/v1/user/${user.id}`)
		.set("Authorization", `Bearer ${user.token}`)
        .send({cpf: "123.321.222-02"})

	expect(res2.body.message).toBe("The cpf is already in use.");
})

test("Verify if cep is valid.", async () => {
    const res2 = await request(app)
    .put(`/v1/user/${user.id}`)
		.set("Authorization", `Bearer ${user.token}`)
        .send({cep: "AAAAsadsa"})

	expect(res2.body.message).toBe("Cep is invalid.");
})