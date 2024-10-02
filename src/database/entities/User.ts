import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Exclude()
    cpf: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    birth: Date;

    @Column()
    email: string;

    @Column()
    qualified: boolean;

    @Column()
    cep: string;

    @Column()
    neighbordhood: string;

    @Column()
    street: string;

    @Column()
    complement: string;

    @Column()
    city: string;

    @Column()
    uf: string;

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @UpdateDateColumn()
    @Exclude()
    updated_at: Date;
}

export default User;
