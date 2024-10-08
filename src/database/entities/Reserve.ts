import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import Car from "./Car";
import User from "./User";

@Entity("reserves")
export class Reserve {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    finalValue: number

    @ManyToOne(() => Car, (car) => car.reserve, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'car_id' })
    @Exclude()
    car: Car;

    @ManyToOne(() => User, (user) => user.reserve, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    @Exclude()
    user: User;

	@CreateDateColumn()
	@Exclude()
	created_at: Date;

	@UpdateDateColumn()
	@Exclude()
	updated_at: Date;
}

export default Reserve;
