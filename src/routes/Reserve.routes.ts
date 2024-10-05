import express from "express";
import { celebrate, Segments } from "celebrate";

import BaseJoi, { type Extension, type Root } from "joi";
import joiDate from "@joi/date";
import authenticateToken from "@api/middlewares/Authenticated";
import ReserveController from "@api/controllers/ReserveController";
const Joi = BaseJoi.extend(joiDate as unknown as Extension) as Root;

const reserveRoutes = express.Router();

const reserveController = new ReserveController();

// Create a new reserve
reserveRoutes.post(
	"/reserve",
	celebrate({
		[Segments.BODY]: {
			startDate: Joi.date().format("DD/MM/YYYY").required(),
			endDate: Joi.date().format("DD/MM/YYYY").required(),
            carId: Joi.number().required()
		}
	}),
	authenticateToken,
	reserveController.create,
);

export default reserveRoutes;
