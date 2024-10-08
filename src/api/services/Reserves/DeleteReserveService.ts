import { getDataSource } from "@database/index";
import Reserve from "@database/entities/Reserve";

import AppError from "@api/middlewares/AppError";
import getUserTokenInfo from "@api/utils/userTokenGet";
import User from "@database/entities/User";

interface IParamas {
	id: number;
	tokenUser: string;
}

export default class DeleteReserveService {
	public async execute({ id, tokenUser }: IParamas): Promise<void> {
		const DataSource = await getDataSource();
		const reserveRepository = DataSource.getRepository(Reserve);
		const userRepository = DataSource.getRepository(User);

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const userExists = await userRepository.findOne({
			where: { id: userId },
		});

		if (!userExists) {
			throw new AppError("User not found.", 404);
		}

		const reserveExists = await reserveRepository.findOne({
			where: { id },
		});

		if (!reserveExists) {
			throw new AppError("Reserve not found.", 404);
		}

		const checkReserveUser = await reserveRepository.findOne({
			where: { user: userExists.id as any, id: reserveExists.id },
			relations: ["user"],
		});

		if (checkReserveUser?.user.id !== userExists.id) {
			throw new AppError("Not Authorized", 401);
		}

		if (!checkReserveUser) {
			throw new AppError("Not Authorized", 401);
		}

		await reserveRepository.remove(reserveExists);
	}
}
