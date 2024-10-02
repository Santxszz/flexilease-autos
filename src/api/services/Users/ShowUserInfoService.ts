import { AppDataSource } from "@database/index";

import User from "@database/entities/User";
import AppError from "@api/middlewares/AppError";

interface IParamas {
	id: number;
}

export default class ShowUserInfoService {
	public async execute({ id }: IParamas): Promise<User> {
		const userRepository = AppDataSource.getRepository(User);
		const userShow = await userRepository.findOne({ where: { id } });

		if (!userShow) {
			throw new AppError("User not found.", 404);
		}
        
        return userShow
	}
}
