import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cod_atendimento: number;

    @Column()
    name: string;

    @Column()
    cep: number

    @Column()
    rua: string;

    @Column()
    numero: number;

    @Column()
    bairro: string;

    @Column()
    cidade: string;

    @Column()
    estado: string;

    @Column()
    data_de_nascimento: Date;

    @Column()
    sexo: string;

    @Column()
    cartao_sus: number;

    @Column()
    cpf: string;

    @Column()
    name_da_mae: string;

    @Column({ default: true })
    status: boolean;

}
