import { getDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Reserve from "@database/entities/Reserve";
import getUserTokenInfo from "@api/utils/userTokenGet";
import Car from "@database/entities/Car";
import { Between } from "typeorm";
import dayjs from "dayjs";
import User from "@database/entities/User";

interface IUpdate {
	id: number;
	tokenUser: string;
	startDate: Date;
	endDate: Date;
	carId: number;
}

export default class UpdateReserveService {
	public async execute({ id, tokenUser, startDate, endDate, carId }: IUpdate) {
		const DataSource = await getDataSource();
		const reserveRepository = DataSource.getRepository(Reserve);
		const carRepository = DataSource.getRepository(Car);
		const userRepository = DataSource.getRepository(User);

		const searchReserve = await reserveRepository.findOne({
			where: { car: carId as any, id },
			relations: ["car", "user"],
		});

		if (!searchReserve) {
			throw new AppError("Reserve not found", 404);
		}

		if (!startDate || !endDate || !carId) {
			startDate = searchReserve?.startDate as Date;
			endDate = searchReserve?.endDate as Date;
			carId = searchReserve?.car.id as number;
		}

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		if (searchReserve.user.id !== userId) {
			throw new AppError("Not Authorized", 401);
		}

		const userExists = await userRepository.findOne({
			where: { id: userId },
		});
		if (!userExists) {
			throw new AppError("The user is not found.", 404);
		}
		if (userExists && userExists.qualified !== true) {
			throw new AppError("The user is not qualifed", 400);
		}

		const carData = await carRepository.findOne({
			where: { id: carId },
		});
		if (!carData) {
			throw new AppError("Car is not found.", 404);
		}

		const reserveExists = await reserveRepository.findOne({
			where: {
				user: userExists.id as any,
				startDate: Between(startDate, endDate),
				endDate: Between(startDate, endDate),
			},

			relations: ["car", "user"],
		});

		if (reserveExists) {
			throw new AppError(
				"Car reserved or your already have reserves for this period.",
				400,
			);
		}

		const carReserveexists = await reserveRepository.findOne({
			where: {
				car: carData.id as any,
				startDate: Between(startDate, endDate),
				endDate: Between(startDate, endDate),
			},

			relations: ["car"],
		});

		if (carReserveexists) {
			throw new AppError(
				"Car reserved or your already have reserves for this period.",
				400,
			);
		}

		const dateInitial = dayjs(startDate);
		const dateFinal = dayjs(endDate);
		const totalValue =
			dateFinal.diff(dateInitial, "days", true) * carData.valuePerDay;

		if (dayjs(dateInitial).isAfter(dayjs(dateFinal))) {
			throw new AppError("The startDate could not be before at endDate", 400);
		}

		searchReserve.startDate = startDate
			? startDate
			: (searchReserve?.startDate as Date);
		searchReserve.endDate = endDate
			? endDate
			: (searchReserve?.endDate as Date);
		searchReserve.car.id = carId ? carId : (searchReserve?.car.id as number);
		searchReserve.finalValue = totalValue;

		const updateReserve = await reserveRepository.save(searchReserve);

		const reserveObject = {
			id: updateReserve.id,
			startDate: dayjs(updateReserve.startDate).format("DD/MM/YYYY"),
			endDate: dayjs(updateReserve.endDate).format("DD/MM/YYYY"),
			finalValue: updateReserve.finalValue,
			userId: updateReserve.user.id,
			carId: updateReserve.car.id,
		};

		return reserveObject;
	}
}
