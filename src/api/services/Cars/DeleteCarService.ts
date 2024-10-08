import { getDataSource } from "@database/index";

import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";
import getUserTokenInfo from "@api/utils/userTokenGet";
import User from "@database/entities/User";

interface IParamas {
	id: number;
	tokenUser: string;
}

export default class DeleteCarService {
	public async execute({ id, tokenUser }: IParamas): Promise<void> {
		const DataSource = await getDataSource();
		const carRepository = DataSource.getRepository(Car);
		const userRepository = DataSource.getRepository(User);

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const userExists = await userRepository.findOne({
			where: { id: userId },
		});

		if (!userExists) {
			throw new AppError("User is not found", 404);
		}

		const carDelete = await carRepository.findOne({
			where: { id },
		});

		if (!carDelete) {
			throw new AppError("Car is not found.", 404);
		}

		await carRepository.remove(carDelete);
	}
}
