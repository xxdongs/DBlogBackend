import { ApiProperty } from "@nestjs/swagger"
import { Article } from "src/article/article.entity"
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

@Entity()
export class Tag {
    constructor(name: string) {
        this.name = name
    }

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @Column({ length: 32 })
    name: string

    @ManyToOne(() => Article, (a) => a.tags)
    article: Article
}
