import bcrypt from "bcrypt";

import { getDataSource } from "@database/index";
import User from "@database/entities/User";
import dayjs from "dayjs";
import type InterfaceRequestUserCreate from "@api/interfaces/InterfaceRequestUserCreate";
import AppError from "@api/middlewares/AppError";
import nameValidation from "@api/utils/nameValidation";
import calcQualified from "@api/utils/verifyQualifyCategory";
import axios from "axios";
import cpfFormater from "@api/utils/cpfFunctions";

export default class CreateUserService {
	public async execute({
		name,
		cpf,
		birth,
		cep,
		email,
		password,
	}: InterfaceRequestUserCreate) {
		const DataSource = await getDataSource();
		const userRepository = DataSource.getRepository(User);

		// Validate Length Password
		if (password.length < 6) {
			throw new AppError("The password must be longer than 6 characters.", 400);
		}

        // Format and Validate CPF
        const cpfFormated = await cpfFormater(cpf)

		// Search if User Exists
		const cpfExists = await userRepository.findOne({ where: { cpf: cpfFormated } });
		const emailExists = await userRepository.findOne({ where: { email } });
		if (cpfExists || emailExists) {
			throw new AppError("The email or cpf already in use.", 400);
		}

		// Validate Name
		if (nameValidation(name)) {
			throw new AppError("Name is invalid remove the numbers.", 400);
		}

		const apiViaCep = await axios.create({
			baseURL: "https://viacep.com.br/ws/",
			timeout: 1000,
			validateStatus: (status) => {
				return status >= 200 && status < 500;
			},
		});

		const resultViaCep = await apiViaCep.get(`${cep}/json`);
		if (resultViaCep.status !== 200) {
			throw new AppError("Cep is invalid.", 400);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 8);

		// Verify birth
		const isQualified = await calcQualified(birth);

		const userCreated = await userRepository.create({
			name,
			cpf: cpfFormated,
			birth,
			cep,
			email,
			password: hashedPassword,
			qualified: Boolean(isQualified),
			city: resultViaCep.data.localidade,
			complement: resultViaCep.data.complemento,
			neighbordhood: resultViaCep.data.bairro,
			street: resultViaCep.data.logradouro,
			uf: resultViaCep.data.uf,
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
