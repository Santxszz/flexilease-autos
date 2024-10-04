import bcrypt from "bcrypt";
import dayjs from "dayjs";

import { getDataSource } from "@database/index";
import User from "@database/entities/User";
import AppError from "@api/middlewares/AppError";
import type InterfaceRequestUserUpdate from "@api/interfaces/InterfaceRequestUserUpdate";
import axios from "axios";
import calcQualified from "@api/utils/verifyQualifyCategory";
import cpfFormater from "@api/utils/cpfFunctions";

export default class UpdateUserService {
	public async execute({
		name,
		cpf,
		birth,
		cep,
		email,
		password,
		// qualified,
		// neighbordhood,
		// street,
		// complement,
		// city,
		// uf,
		id,
	}: InterfaceRequestUserUpdate) {
		const DataSource = await getDataSource();
		const userRepository = await DataSource.getRepository(User);

		const userExists = await userRepository.findOne({ where: { id } });
		if (!userExists) {
			throw new AppError("User is not found", 404);
		}

		if (!email) {
			const emailExists = await userRepository.findOne({ where: { email } });
			email = userExists?.email;
			if (emailExists && email !== userExists.email) {
				throw new AppError("The email already in use.", 400);
			}
		} else {
			const emailExists = await userRepository.findOne({ where: { email } });
			if (emailExists && email !== userExists.email) {
				throw new AppError("The email already in use.", 400);
			}
		}

		if (!cpf) {
			const cpfExists = await userRepository.findOne({
				where: { cpf: userExists?.cpf },
			});
			cpf = userExists?.cpf;
			if (cpfExists && cpf !== cpfExists.cpf) {
				throw new AppError("The cpf is already in use.", 400);
			}
		} else {
			const cpfExists = await userRepository.findOne({
				where: { cpf: userExists?.cpf },
			});
			if (cpfExists && cpf !== cpfExists.cpf) {
				throw new AppError("The cpf is already in use.", 400);
			}
		}

		const hashedPassword = await bcrypt.hash(String(password), 8);
		if (!password) {
			password = userExists.password;
		} else {
			password = hashedPassword;
		}

		const apiViaCep = axios.create({
			baseURL: "https://viacep.com.br/ws/",
			timeout: 1000,
			validateStatus: (status) => {
				return status >= 200 && status < 500;
			},
		});

		const resultViaCep = await apiViaCep.get(
			`${cep ? cep : userExists.cep}/json`,
		);
		if (resultViaCep.status !== 200) {
			throw new AppError("Cep is invalid.", 400);
		}

		const cpfFormated = await cpfFormater(cpf);

		const isQualified = await calcQualified(birth);

		userExists.name = name ? name : userExists.name;
		userExists.cpf = cpf ? cpfFormated : userExists.cpf;
		userExists.birth = birth ? birth : userExists.birth;
		userExists.cep = cep ? cep : userExists.cep;
		userExists.email = email ? email : userExists.email;
		userExists.password = password;
		userExists.qualified = birth ? isQualified : userExists.qualified;
		userExists.neighbordhood = cep
			? resultViaCep.data.bairro
			: userExists.neighbordhood;
		userExists.street = cep ? resultViaCep.data.logradouro : userExists.street;
		userExists.complement = cep
			? resultViaCep.data.complemento
			: userExists.complement;
		userExists.city = cep ? resultViaCep.data.localidade : userExists.city;
		userExists.uf = cep ? resultViaCep.data.uf : userExists.uf;

		await userRepository.save(userExists);

		const userObjectResponse = {
			id: userExists.id,
			name: userExists.name,
			cpf: userExists.cpf,
			birth: dayjs(userExists.birth).format("DD/MM/YYYY"),
			email: userExists.email,
			qualified: userExists.qualified,
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
