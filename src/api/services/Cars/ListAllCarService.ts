import bcrypt from "bcrypt";
import dayjs from "dayjs";

import { AppDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import nameValidation from "@api/utils/nameValidation";
import Car from "@database/entities/Car";

import type InterfaceRequestCarCreate from "@api/interfaces/InterfaceRequestCarCreate";

export default class ListAllCarService {
	public async execute(page: number, skip: number, take: number, search: undefined) {
		const carRepository = AppDataSource.getRepository(Car);

		if (search) {
			const [cars, count] = await carRepository
				.createQueryBuilder()
				.skip(skip)
				.orWhere({ model: search })
				.orWhere({ color: search })
				.orWhere({ year: search })
				.orWhere({ valuePerDay: search })
				.orWhere({ acessories: search })
				.orWhere({ numberOfPassengers: search })

				.take(take)
				.getManyAndCount();

			const result = {
				car: cars,
				total: count,
				limit: take,
				offset: page,
				offsets: take,
			};

			return result;
		}

		const [cars, count] = await carRepository
			.createQueryBuilder()
			.skip(skip)
			.take(take)
			.getManyAndCount();

		const result = {
			car: cars,
			total: count,
			limit: take,
			offset: page,
			offsets: take,
		};

		return result;
	}
}
