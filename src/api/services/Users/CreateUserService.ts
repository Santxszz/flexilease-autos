import bcrypt from "bcrypt";

import { AppDataSource } from "@database/index";
import User from "@database/entities/User";
import AppError from "@api/middlewares/AppError";
import dayjs from "dayjs";
import nameValidation from "@api/utils/nameValidation";
import type InterfaceRequestUserCreate from "@api/interfaces/InterfaceRequestUserCreate";

export default class CreateUserService {
	public async execute({
		name,
		cpf,
		birth,
		cep,
		email,
		password,
		qualified,
		neighbordhood,
		street,
		complement,
		city,
		uf,
	}: InterfaceRequestUserCreate) {
		const userRepository = AppDataSource.getRepository(User);

		// Validate Length Password
		if (password.length < 6) {
			throw new AppError("The password must be longer than 6 characters.", 400);
		}

		// Search if User Exists
		const cpfExists = await userRepository.findOne({ where: { cpf } });
		const emailExists = await userRepository.findOne({ where: { email } });
		if (cpfExists || emailExists) {
			throw new AppError("The email or cpf already in use", 400);
		}

		// Validate Name
		if (nameValidation(name)) {
			throw new AppError("Name is invalid", 400);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 8);

		const userCreated = userRepository.create({
			name,
			cpf,
			birth,
			cep,
			email,
			password: hashedPassword,
			qualified,
			neighbordhood,
			street,
			complement,
			city,
			uf,
		});
		await userRepository.save(userCreated);

		const userObjectResponse = {
			id: userCreated.id,
			name: userCreated.name,
			cpf: userCreated.cpf,
			birth: dayjs(userCreated.birth).format("DD/MM/YYYY"),
			email: userCreated.email,
			qualified: !!userCreated.qualified,
			cep: userCreated.cep,
			neighbordhood: userCreated.neighbordhood,
			street: userCreated.street,
			complement: userCreated.complement,
			city: userCreated.city,
			uf: userCreated.uf,
		};

		return userObjectResponse;
	}
}
