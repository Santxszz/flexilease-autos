import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "@database/index";
import User from "@database/entities/User";
import AppError from "@api/middlewares/AppError";
import type InterfaceAuthUser from "@api/interfaces/InterfaceAuthUser";

export default class UserAuthService {
	public async execute({ email, password }: InterfaceAuthUser) {
		const userRepository = AppDataSource.getRepository(User);

		const findUserByEmail = await userRepository.findOne({ where: { email } });
		if (!findUserByEmail) {
			throw new AppError("Email or password is incorrect", 400);
		}

		const decodedPassword = await bcrypt.compare(
			password,
			findUserByEmail.password,
		);
		if (decodedPassword) {
			const tokenPayload = {
				userId: findUserByEmail.id,
				name: findUserByEmail.name,
				email: findUserByEmail.email,
			};
			const userToken = await jwt.sign(
				tokenPayload,
				process.env.JWT_SECRET as string,
				{ expiresIn: "12h" },
			);
			return userToken;
		}

		throw new AppError("Email or Password is Incorrect!", 400);
	}
}
