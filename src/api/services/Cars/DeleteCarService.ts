import { AppDataSource } from "@database/index";

import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";

interface IParamas {
	id: number;
}

export default class DeleteCarService {
	public async execute({ id }: IParamas): Promise<void> {
		const carRepository = AppDataSource.getRepository(Car);

		const carDelete = await carRepository.findOne({
			where: { id },
		});

		if (!carDelete) {
			throw new AppError("User is not found.", 404);
		}

		await carRepository.remove(carDelete);
	}
}
