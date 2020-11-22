import { ApiProperty } from "@nestjs/swagger"
import { Article } from "src/article/article.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from "typeorm"

@Entity()
export class Comment {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column({ length: 16, unique: true })
    name: string

    @ApiProperty()
    @ManyToOne(() => Article, (a) => a.comments)
    article: Article

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date
}
