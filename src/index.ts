import "reflect-metadata";
import "express-async-errors";
import express, { type Response, type Request, type NextFunction } from "express";
import "dotenv/config";
import { errors } from "celebrate";
import swaggerUI from "swagger-ui-express";
import swaggerDocumentation from "../swagger.json";

import "@database/index";
import AppError from "@api/middlewares/AppError";

import userRoutes from "./routes/Users.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", userRoutes);
app.use("/v1/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

app.use(errors());

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            code: error.statusCode,
            status: error.statusMessage,
            message: error.message,
        });
    }

    return response.status(500).json({
        code: 500,
        status: "Internal Server Error",
        message: "Ocorreu um erro inesperado",
    });
});

const PORT = process.env.PORT_SERVER || 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[🤖] API: COMPASSCINE - ONLINE - PORTA: ${PORT}`);
});
