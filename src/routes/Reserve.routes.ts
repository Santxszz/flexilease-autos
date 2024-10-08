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
			carId: Joi.number().required(),
		},
	}),
	authenticateToken,
	reserveController.create,
);

// List all reserves of user
reserveRoutes.get(
	"/reserve",
	celebrate({
		[Segments.QUERY]: {
			page: Joi.number().min(1).optional(),
			limit: Joi.number().min(1).optional(),
			startDate: Joi.date().format("DD/MM/YYYY").optional(),
			endDate: Joi.date().format("DD/MM/YYYY").optional(),
			finalValue: Joi.number().optional(),
			carId: Joi.number().optional().min(1),
		},
	}),
	authenticateToken,
	reserveController.listAll,
);

// List a specific reserve
reserveRoutes.get(
	"/reserve/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().min(1).required(),
		},
	}),
	authenticateToken,
	reserveController.show,
);

// Update a specific reserve
reserveRoutes.put(
	"/reserve/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().min(1).required(),
		},
		[Segments.BODY]: {
			startDate: Joi.date().format("DD/MM/YYYY").optional(),
			endDate: Joi.date().format("DD/MM/YYYY").optional(),
			carId: Joi.number().min(1).optional(),
		},
	}),
	authenticateToken,
	reserveController.update,
);

// Delete a specific reserve
reserveRoutes.delete(
	"/reserve/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().min(1).required(),
		},
	}),
    authenticateToken,
    reserveController.delete
);

export default reserveRoutes;
