import { AppDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Reserve from "@database/entities/Reserve";
import getUserTokenInfo from "@api/utils/userTokenGet";

export default class ShowReserveService {
	public async execute(id: number, tokenUser: string) {
		const reserveRepository = AppDataSource.getRepository(Reserve);

        const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const showReserve = await reserveRepository.findOne({ where: { id: id, user: userId }, relations: ["car", "user"] });
		if (!showReserve) {
			throw new AppError("Reserve not found", 404);
		}

        if(showReserve.user.id !== userId) {
            throw new AppError("Not authorized", 401)
        }


		const objectResult = {
			id: showReserve.id,
            startDate: showReserve.startDate,
            endDate: showReserve.endDate,
            finalValue: showReserve.finalValue, 
            userId: showReserve.user.id,
            carId: showReserve.car.id
		};

		return objectResult;
	}
}
