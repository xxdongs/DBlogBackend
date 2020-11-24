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
    @Column({ default: true })
    open: boolean

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
