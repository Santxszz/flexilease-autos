import type { Request, Response } from "express";
// import { instanceToInstance } from "class-transformer";
import CreateReserveService from "@api/services/Reserves/CreateReserveService";

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
}
