import { type MigrationInterface, type QueryRunner, Table } from "typeorm";

export class CreateUser1727820207184 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "users",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
					},
					{
						name: "name",
						type: "varchar",
					},
					{
						name: "cpf",
						type: "varchar",
						isUnique: true,
					},
					{
						name: "password",
						type: "varchar",
					},
					{
						name: "birth",
						type: "date",
					},
					{
						name: "email",
						type: "varchar",
						isUnique: true,
					},
					{
						name: "qualified",
						type: "boolean",
					},
					{
						name: "cep",
						type: "varchar",
					},
					{
						name: "neighbordhood",
						type: "varchar",
					},
					{
						name: "street",
						type: "varchar",
					},
					{
						name: "complement",
						type: "varchar",
					},
					{
						name: "city",
						type: "varchar",
					},
					{
						name: "uf",
						type: "varchar",
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
		await queryRunner.dropTable("users");
	}
}
