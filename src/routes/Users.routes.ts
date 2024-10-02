import express from "express";
import { celebrate, Segments } from "celebrate";

import BaseJoi, { type Extension, type Root } from "joi";
import joiDate from "@joi/date";
import UserController from "@api/controllers/UserController";
import authenticateToken from "@api/middlewares/Authenticated";
const Joi = BaseJoi.extend(joiDate as unknown as Extension) as Root;

const userRoutes = express.Router();

const userController = new UserController();

// Create a new user
userRoutes.post(
	"/user",
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			cpf: Joi.string().required(),
			birth: Joi.date().format("DD/MM/YYYY").required(),
			cep: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		},
	}),
	userController.create,
);

// Auth a user
userRoutes.post(
	"/auth",
	celebrate({
		[Segments.BODY]: {
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		},
	}),
    userController.auth
);

// Test Auth Middleware
userRoutes.get('/user', authenticateToken)

export default userRoutes;
