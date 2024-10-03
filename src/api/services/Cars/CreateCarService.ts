import { AppDataSource } from "@database/index";
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
		const carRepository = AppDataSource.getRepository(Car);

		const acessoriesArray: any[] = [];
		acessories.map((item: any) => {
			acessoriesArray.push(item.name);
			console.log(item.name);
		});

		if (year < 1950 || year > 2023) {
			throw new AppError(
				"The year of vehicle is invalid, must be between 1930-2023!",
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
