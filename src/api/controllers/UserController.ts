import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";

import CreateUserService from "@api/services/Users/CreateUserService";

import UserAuthService from "@api/services/Users/UserAuthService";
import UpdateUserService from "@api/services/Users/UpdateUserService";
import DeleteUserService from "@api/services/Users/DeleteUserService";
import ShowUserInfoService from "@api/services/Users/ShowUserInfoService";

export default class UserController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { name, cpf, birth, cep, email, password } = req.body;

		const userService = new CreateUserService();

		const user = await userService.execute({
			name,
			cpf,
			birth,
			cep,
			email,
			password,
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
		const id = Number(req.params.id);

		const userService = new DeleteUserService();
		await userService.execute({ id });
		return res.status(204).json();
	}

	public async show(req: Request, res: Response): Promise<Response> {
		const id = Number(req.params.id);
		const userService = new ShowUserInfoService();
		const userShow = await userService.execute({ id });
		return res.status(200).json(instanceToInstance(userShow));
	}
}
