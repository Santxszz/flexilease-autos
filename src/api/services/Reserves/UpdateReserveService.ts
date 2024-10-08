import { getDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Reserve from "@database/entities/Reserve";
import getUserTokenInfo from "@api/utils/userTokenGet";
import Car from "@database/entities/Car";
import { Between } from "typeorm";

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

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const updateReserve = await reserveRepository.findOne({
			where: { id: id, user: userId },
			relations: ["car", "user"],
		});
		if (!updateReserve) {
			throw new AppError("Reserve not found", 404);
		}

		// if (updateReserve.user.id !== userId) {
		// 	throw new AppError("Not authorized", 401);
		// }

		const carExists = await carRepository.findOne({ where: { id: carId } });
		if (!carExists) {
			throw new AppError("Car is not found", 404);
		}

        // const carReserveexists = await carRepository.findOne({
		// 	where: {
		// 		id: carId
                
		// 	},

		// 	relations: ["reserve"],
		// });

        // carReserveexists?.reserve.map((item) => {
        //     console.log(item.startDate)
        // })

        // console.log(carReserveexists?.reserve)

        startDate ? startDate : updateReserve.startDate
        endDate ? endDate : updateReserve.endDate

        console.log(startDate, endDate)

        const carReservedPeriod = await reserveRepository.find({
            where: {
                car: carId as any,
                startDate: Between(startDate, endDate)
            }
        })
        console.log(carReservedPeriod)


		// updateReserve.startDate = startDate ? startDate : updateReserve.startDate;
		// updateReserve.endDate = endDate ? endDate : updateReserve.endDate;
		// updateReserve.car.id = carId ? carId : updateReserve.car.id;

		// await reserveRepository.save(updateReserve);

		// return updateReserve;
	}
}
