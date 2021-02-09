import { ApiProperty } from "@nestjs/swagger"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm"

@Entity()
export class Message {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column({ nullable: true, comment: "Contact information" })
    contact: string

    @ApiProperty()
    @Column({ type: "text" })
    content: string

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date
}
