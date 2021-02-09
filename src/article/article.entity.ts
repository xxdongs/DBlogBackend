import { ApiProperty } from "@nestjs/swagger"
import { Comment } from "src/comment/comment.entity"
import { Tag } from "src/tag/tag.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
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
    @Column({
        default: true,
        comment: "Whether the article is opened to everyone.",
    })
    open: boolean

    @ApiProperty()
    @Column({
        default: 0,
        comment: "How many times that people liked this article.",
    })
    liked: number

    @ApiProperty()
    @Column({
        default: 0,
        comment: "How many times that people read this article.",
    })
    read: number

    @OneToMany(() => Tag, (tag) => tag.article)
    tags: Tag[]

    @OneToMany(() => Comment, (c) => c.article)
    comments: Comment[]

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date

    @ApiProperty()
    @UpdateDateColumn({ type: "timestamp" })
    update: Date
}
