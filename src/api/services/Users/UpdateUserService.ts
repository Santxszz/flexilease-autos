import bcrypt from "bcrypt";
import dayjs from "dayjs";

import { AppDataSource } from "@database/index";
import User from "@database/entities/User";
import AppError from "@api/middlewares/AppError";
import type InterfaceRequestUserUpdate from "@api/interfaces/InterfaceRequestUserUpdate";

export default class UpdateUserService {
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
		id,
	}: InterfaceRequestUserUpdate) {
		const userRepository = AppDataSource.getRepository(User);

		const userExists = await userRepository.findOne({ where: { id } });
		if (!userExists) {
			throw new AppError("User is not found", 404);
		}

		const emailExists = await userRepository.findOne({ where: { email } });
		if (emailExists && email !== userExists.email) {
			throw new AppError("The email is already registered", 400);
		}

		const cpfExists = await userRepository.findOne({ where: { cpf } });
		if (cpfExists && cpf !== userExists.cpf) {
			throw new AppError("The cpf is already registered", 400);
		}

		const hashedPassword = await bcrypt.hash(String(password), 8);
		if (!password) {
			password = userExists.password;
		} else {
			password = hashedPassword;
		}

		userExists.name = name ? name : userExists.name;
		userExists.cpf = cpf ? cpf : userExists.cpf;
		userExists.birth = birth ? birth : userExists.birth;
		userExists.cep = cep ? cep : userExists.cep;
		userExists.email = email ? email : userExists.email;
		userExists.password = password;
		userExists.qualified = qualified ? qualified : userExists.qualified;
		userExists.neighbordhood = neighbordhood
			? neighbordhood
			: userExists.neighbordhood;
		userExists.street = street ? street : userExists.street;
		userExists.complement = complement ? complement : userExists.complement;
		userExists.city = city ? city : userExists.city;
		userExists.uf = uf ? uf : userExists.uf;

		await userRepository.save(userExists);

		const userObjectResponse = {
			id: userExists.id,
			name: userExists.name,
			cpf: userExists.cpf,
			birth: dayjs(userExists.birth).format("DD/MM/YYYY"),
			email: userExists.email,
			qualified: userExists.qualified ? "Qualificado" : "Não Qualificado",
			cep: userExists.cep,
			neighbordhood: userExists.neighbordhood,
			street: userExists.street,
			complement: userExists.complement,
			city: userExists.city,
			uf: userExists.uf,
		};

		return userObjectResponse;
	}
}
