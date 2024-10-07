import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";

import CreateReserveService from "@api/services/Reserves/CreateReserveService";
import ListReserveService from "@api/services/Reserves/ListReserveService";
import ShowReserveService from "@api/services/Reserves/ShowReserveService";

export default class ReserveController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { startDate, endDate, carId } = req.body;
		const tokenUser = String(req.headers.authorization);

		const createReserve = new CreateReserveService();
		const create = await createReserve.execute({
			startDate,
			endDate,
			carId,
			tokenUser,
		});
		return res.status(201).json(create)
	}

    public async listAll(req: Request, res: Response): Promise<Response> {
		const page = Number(req.query.page);
		const limit = Number(req.query.limit);
        const tokenUser = String(req.headers.authorization);

		const { startDate, endDate, finalValue, carId } =
			req.query;
		let search: string | number | string[] | undefined;
		if (startDate) {
			search = startDate as string;
		}
		if (endDate) {
			search = endDate as string;
		}
		if (finalValue) {
			search = Number(finalValue) as number;
		}
		if (carId) {
			search = Number(carId) as number;
		}

		const carService = new ListReserveService();

		const take = limit;
		const skip = (Number(page) - 1) * Number(take);
		const cars = await carService.execute(
			page,
			skip,
			take,
			search as undefined,
            tokenUser
		);

		return res.status(200).json(instanceToInstance(cars));
	}

    public async show(req: Request, res: Response): Promise<Response> {
        const tokenUser = String(req.headers.authorization);
        const id = Number(req.params.id)

        const showReserve = new ShowReserveService()
        const show = await showReserve.execute(id, tokenUser)

        return res.status(200).json(show)

    }
}
