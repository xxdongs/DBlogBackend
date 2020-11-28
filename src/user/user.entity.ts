import { ApiProperty } from "@nestjs/swagger";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { UserGroup } from "../util/user.group";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 32, nullable: true, unique: true })
    username: string;

    @Exclude()
    @Column({ length: 32 })
    password: string;

    @ApiProperty()
    @Column({ length: 32, unique: true })
    email: string;

    @ApiProperty()
    @Column({ length: 16, nullable: true })
    avatar: string;

    @ApiProperty()
    @Column({ default: true })
    gender: boolean;
    @ApiProperty()
    @Column({ length: 16, nullable: true })
    city: string;

    @ApiProperty()
    @Column({ default: UserGroup.USER })
    group: UserGroup;

    @ApiProperty()
    @Column({ type: "tinytext", nullable: true })
    summary: string;

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date;

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    update: Date;
}
