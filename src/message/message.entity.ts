import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/user/user.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
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

    @ManyToOne(() => User, (user) => user.messages)
    user: User

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date
}
