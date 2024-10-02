import axios from "axios";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";

import CreateUserService from "@api/services/Users/CreateUserService";

import calcQualified from "@api/utils/verifyQualifyCategory";
import AppError from "@api/middlewares/AppError";
import UserAuthService from "@api/services/Users/UserAuthService";
import UpdateUserService from "@api/services/Users/UpdateUserService";
import type JwtPayload from "@api/interfaces/InterfaceJwtPayload";
import DeleteUserService from "@api/services/Users/DeleteUserService";

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

		const acessToken = await authService.execute({ email, password });
		return res.status(200).json({ acessToken: acessToken });
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const { name, cpf, birth, cep, email, password } = req.body;
		const id = Number(req.params.id);
		const userToken = req.headers.authorization;

		jwt.verify(
			userToken as string,
			process.env.JWT_SECRET as string,
			(err, userInfo) => {
				if (err) {
					throw new AppError("Token is Invalid", 400);
				}
				const tokenPayload = userInfo as JwtPayload;
				if (tokenPayload.userId !== id) {
					throw new AppError("Not Authorized", 401);
				}
			},
		);

		const userService = new UpdateUserService();
		const updatedUser = await userService.execute({
			name,
			cpf,
			birth,
			cep,
			email,
			password,
			id,
		});

		return res.status(200).json(updatedUser);
	}

	public async delete(req: Request, res: Response): Promise<Response> {
		const userToken = req.headers.authorization;
		const id = Number(req.params.id);

		jwt.verify(
			userToken as string,
			process.env.JWT_SECRET as string,
			(err, userInfo) => {
				if (err) {
					throw new AppError("Token is Invalid", 400);
				}
				const tokenPayload = userInfo as JwtPayload;
				if (tokenPayload.userId !== id) {
					throw new AppError("Not Authorized", 401);
				}
			},
		);

		const userService = new DeleteUserService();
		await userService.execute({ id });
		return res.status(204).json();
	}
}
