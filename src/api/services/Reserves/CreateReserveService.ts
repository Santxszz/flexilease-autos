import { getDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import jwtToken from "jsonwebtoken";
import Car from "@database/entities/Car";

import { Between } from "typeorm";

import type IReserveCreate from "@api/interfaces/InterfaceReserveCreate";
import Reserve from "@database/entities/Reserve";
import User from "@database/entities/User";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import getUserTokenInfo from "@api/utils/userTokenGet";
dayjs.extend(isBetween);

export default class CreateReserveService {
	public async execute({
		startDate,
		endDate,
		carId,
		tokenUser,
	}: IReserveCreate) {
		const DataSource = await getDataSource();

		const reserveRepository = DataSource.getRepository(Reserve);
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

		const carReserveexists = await reserveRepository.findOne({
			where: {
				car: carData,
				startDate: Between(startDate, endDate),
				endDate: Between(startDate, endDate),
			},

			relations: ["car"],
		});

		if (carReserveexists) {
			throw new AppError("That's car is already reserved.");
		}

		const reserveExists = await reserveRepository.findOne({
			where: {
				startDate: Between(startDate, endDate),
				endDate: Between(startDate, endDate),
				user: userId,
			},

			relations: ["car"],
		});

		if (reserveExists) {
			throw new AppError(
				`You already have reservations for this period! Car Reserved: ${reserveExists.car.model}`,
			);
		}

		const dateInitial = dayjs(startDate);
		const dateFinal = dayjs(endDate);
		const finalValue =
			dateFinal.diff(dateInitial, "days", true) * carData.valuePerDay;

		if (dayjs(dateInitial).isAfter(dayjs(dateFinal))) {
			throw new AppError("The startDate could not be before at endDate");
		}

		const createReserve = reserveRepository.create({
			car: carData,
			startDate,
			finalValue: finalValue,
			endDate,
			user: userId,
		});

		await reserveRepository.save(createReserve);

		const reserveObject = {
			id: createReserve.id,
			startDate: dayjs(createReserve.startDate).format("DD/MM/YYYY"),
			endDate: dayjs(createReserve.endDate).format("DD/MM/YYYY"),
			finalValue: createReserve.finalValue,
			userId: createReserve.user,
			carId: createReserve.car.id,
		};

		return reserveObject;
	}
}
