import { getDataSource } from "@database/index";
import User from "@database/entities/User";

import AppError from "@api/middlewares/AppError";

interface IParamas {
	id: number;
}

export default class DeleteUserService {
	public async execute({ id }: IParamas): Promise<void> {
		const DataSource = await getDataSource();
		const userRepository = await DataSource.getRepository(User);

		const userDelete = await userRepository.findOne({
			where: { id },
		});

		if (!userDelete) {
			throw new AppError("User is not found.", 404);
		}

		await userRepository.remove(userDelete);
	}
}
