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
		name: "Erek Delete",
		cpf: "000.000.000-12",
		birth: "25/02/2004",
		cep: "76400-000",
		email: "userDelete@gmail.com",
		password: "123456",
	});

    user = {...res}
    const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
	};
	user.token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

});


test("The system should delete a specifc user", async () => {
	const res = await request(app)
		.delete(`/v1/user/${user.id}`)
		.set("Authorization", `Bearer ${user.token}`);

	expect(res.statusCode).toBe(204);
});

test("The system should block delete the one user if token is not yours.", async () => {
	const res = await request(app)
		.delete("/v1/user/9999999")
		.set("Authorization", `Bearer ${user.token}`);

	expect(res.statusCode).toBe(401);
	expect(res.body.message).toBe("Not Authorized.");
});


// test("Not found the user", async () => {
// 	const res = await request(app)
// 		.delete("/v1/user/122222222")
// 		.set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm5hbWUiOiJFcmVrIERlbGV0ZSIsImVtYWlsIjoidXNlckRlbGV0ZUBnbWFpbC5jb20iLCJpYXQiOjE3Mjc5OTA1ODMsImV4cCI6MTcyODAzMzc4M30.81A_sWlgffd2JtcogLpYdKxsmq5l9JhGlk_NqdvuzFM");

// 	expect(res.statusCode).toBe(404);
// 	expect(res.body.message).toBe("User is not found.");
// });
