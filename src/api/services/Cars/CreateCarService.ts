import { getDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";

import type InterfaceRequestCarCreate from "@api/interfaces/InterfaceRequestCarCreate";

export default class CreateCarService {
	public async execute({
		model,
		color,
		year,
		valuePerDay,
		acessories,
		numberOfPassengers,
	}: InterfaceRequestCarCreate) {
		const DataSource = await getDataSource();
		const carRepository = DataSource.getRepository(Car);

		const acessoriesArray: any[] = [];
		acessories.map((item: any) => {
			if (!Object(item).hasOwnProperty("name")) {
				throw new AppError(
					"The acessories not accept another syntax! Please use [ acessories: {name: value} ]",
					400,
				);
			}

			acessoriesArray.push(item.name);
		});

		if (year < 1950 || year > 2023) {
			throw new AppError(
				"The year of vehicle is invalid, must be between 1950-2023!",
			);
		}

		if (acessories.length < 1) {
			throw new AppError("Requires at least one accessory!");
		}

		const createCar = carRepository.create({
			model,
			color,
			year,
			valuePerDay,
			acessories: acessoriesArray,
			numberOfPassengers,
		});

		await carRepository.save(createCar);

		const resultObjectCar = {
			id: createCar.id,
			model: createCar.model,
			color: createCar.color,
			year: createCar.year,
			valuePerDay: createCar.valuePerDay,
			acessories: acessories,
			numberOfPassengers: numberOfPassengers,
		};

		return resultObjectCar;
	}
}
