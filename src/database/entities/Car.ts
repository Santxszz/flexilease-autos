import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import Reserve from "./Reserve";

@Entity("cars")
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    model: string;

    @Column()
    color: string;

    @Column()
    year: number;

    @Column()
    valuePerDay: number;

    @Column("simple-array", {array: true, nullable: false})
    acessories: string[];

    @Column()
    numberOfPassengers: number;

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @UpdateDateColumn()
    @Exclude()
    updated_at: Date;

    @OneToMany(() => Reserve, (reserve) => reserve.car, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    reserve: Reserve[];
}

export default Car;
