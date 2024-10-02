import { type MigrationInterface, type QueryRunner, Table } from "typeorm";

export class CreateCar1727863959699 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
			new Table({
				name: "cars",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
					},
					{
                        name: "model",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "color",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "year",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "valuePerDay",
                        type: "number",
                        isNullable: false
                    },
                    {
                        name: "acessories",
                        type: "string",
                        isArray: true,
                        isNullable: false
                    },
                    {
                        name: "numberOfPassengers",
                        type: "number",
                        isNullable: true
                    },
					{
						name: "created_at",
						type: "timestamp with time zone",
						default: "now()",
					},
					{
						name: "updated_at",
						type: "timestamp with time zone",
						default: "now()",
					},
				],
			}),
		);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cars')
    }

}
