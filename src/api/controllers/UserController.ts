import axios from "axios";
import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";

import CreateUserService from "@api/services/Users/CreateUserService";

import calcQualified from "@api/utils/verifyQualifyCategory";
import AppError from "@api/middlewares/AppError";
import UserAuthService from "@api/services/Users/UserAuthService";

export default class UserController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { name, cpf, birth, cep, email, password } = req.body;

		const userService = new CreateUserService();

		const apiViaCep = axios.create({
			baseURL: "https://viacep.com.br/ws/",
			timeout: 1000,
			validateStatus: (status) => {
				return status >= 200 && status < 500;
			},
		});

		const resultViaCep = await apiViaCep.get(`${cep}/json`);
		if (resultViaCep.status !== 200) {
			throw new AppError("Cep is invalid", 400);
		}

		const isQualified = await calcQualified(birth);
		const user = await userService.execute({
			name,
			cpf,
			birth,
			cep,
			email,
			password,
			qualified: Boolean(isQualified),
			city: resultViaCep.data.localidade,
			complement: resultViaCep.data.complemento,
			neighbordhood: resultViaCep.data.bairro,
			street: resultViaCep.data.logradouro,
			uf: resultViaCep.data.uf,
		});

		return res.status(201).json(instanceToInstance(user));
	}

	public async auth(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body;
		const authService = new UserAuthService();

        const acessToken = await authService.execute({email, password})
        return res.status(200).json({acessToken: acessToken})

	}
}
