import { getDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Reserve from "@database/entities/Reserve";
import getUserTokenInfo from "@api/utils/userTokenGet";
import dayjs from "dayjs";

export default class ShowReserveService {
	public async execute(id: number, tokenUser: string) {
		const DataSource = await getDataSource();
		const reserveRepository = DataSource.getRepository(Reserve);

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const showReserve = await reserveRepository.findOne({
			where: { id: id, user: userId },
			relations: ["car", "user"],
		});
		if (!showReserve) {
			throw new AppError("Reserve not found", 404);
		}

		if (showReserve.user.id !== userId) {
			throw new AppError("Not authorized", 401);
		}

		const objectResult = {
			id: showReserve.id,
			startDate: dayjs(showReserve.startDate).format("DD/MM/YYYY"),
			endDate: dayjs(showReserve.endDate).format("DD/MM/YYYY"),
			finalValue: showReserve.finalValue.toLocaleString("pt-br", {
				style: "currency",
				currency: "BRL",
			}),
			userId: showReserve.user.id,
			carId: showReserve.car.id,
		};

		return objectResult;
	}
}
