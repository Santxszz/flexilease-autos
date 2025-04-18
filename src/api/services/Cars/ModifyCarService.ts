import { getDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";
import type InterfaceRequestCarUpdate from "@api/interfaces/InterfaceRequestCarUpdate";
import getUserTokenInfo from "@api/utils/userTokenGet";
import User from "@database/entities/User";

export default class ModifyCarService {
	public async execute({
		model,
		color,
		year,
		valuePerDay,
		acessories,
		numberOfPassengers,
		id,
		tokenUser,
	}: InterfaceRequestCarUpdate) {
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

		const updateCar = await carRepository.findOne({ where: { id } });
		if (!updateCar) {
			throw new AppError("Car not found", 404);
		}

		const acessoriesArray: any[] = [];
		acessories?.map((item: any) => {
			if (!Object(item).hasOwnProperty("name")) {
				throw new AppError(
					"The acessories not accept another syntax! Please use [ acessories: {name: value} ]",
					400,
				);
			}

			acessoriesArray.push(item.name);
		});

		if (Number(year) < 1950 || Number(year) > 2023) {
			throw new AppError(
				"The year of vehicle is invalid, must be between 1950-2023!",
			);
		}

		if (updateCar.acessories.length < 1) {
			throw new AppError("Requires at least one accessory!", 400);
		}

		updateCar.model = model ? model : updateCar.model;
		updateCar.color = color ? color : updateCar.color;
		updateCar.year = year ? year : updateCar.year;
		updateCar.valuePerDay = valuePerDay ? valuePerDay : updateCar.valuePerDay;
		updateCar.acessories = acessories ? acessoriesArray : updateCar.acessories;
		updateCar.numberOfPassengers = numberOfPassengers
			? numberOfPassengers
			: updateCar.numberOfPassengers;

		await carRepository.save(updateCar);

		const resultObjectCar = {
			id: updateCar.id,
			model: updateCar.model,
			color: updateCar.color,
			year: updateCar.year,
			valuePerDay: updateCar.valuePerDay,
			acessories: acessories,
			numberOfPassengers: updateCar.numberOfPassengers,
		};

		return resultObjectCar;
	}
}
