import { ApiProperty } from "@nestjs/swagger"
import { Article } from "src/article/article.entity"
import { Message } from "src/message/message.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from "typeorm"
import { UserGroup } from "../util/user.group"

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column({ length: 32, nullable: true, unique: true })
    username: string

    @Column({ length: 32 })
    password: string

    @ApiProperty()
    @Column({ length: 32, unique: true })
    email: string

    @ApiProperty()
    @Column({ length: 16, nullable: true })
    avatar: string

    @ApiProperty()
    @Column({ default: true })
    gender: boolean
    @ApiProperty()
    @Column({ length: 16, nullable: true })
    city: string

    @ApiProperty()
    @Column({ default: UserGroup.USER })
    group: UserGroup

    @ApiProperty()
    @Column({ type: "tinytext", nullable: true })
    summary: string

    @OneToMany(() => Article, (a) => a.user)
    article: Article[]

    @OneToMany(() => Message, (m) => m.user)
    messages: Message[]

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    update: Date
}
