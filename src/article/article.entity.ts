import { ApiProperty } from "@nestjs/swagger"
import { Comment } from "src/comment/comment.entity"
import { Tag } from "src/tag/tag.entity"
import { User } from "src/user/user.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm"

@Entity()
export class Article {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column({ length: 32, unique: true })
    title: string

    @ApiProperty()
    @Column({ type: "text" })
    content: string

    @ApiProperty()
    @Column({ default: true })
    open: boolean

    @OneToMany(() => Tag, (tag) => tag.article)
    tags: Tag[]

    @OneToMany(() => Comment, (c) => c.article)
    comments: Comment[]

    @ManyToOne(() => User, (user) => user.article)
    user: User

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date

    @ApiProperty()
    @UpdateDateColumn({ type: "timestamp" })
    update: Date
}
