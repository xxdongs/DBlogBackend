import { ApiProperty } from "@nestjs/swagger";
import { NoticeType } from "src/util/constant";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export class Notice {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 16, comment: "The type of this notice." })
    type: NoticeType;

    @ApiProperty()
    @Column({
        length: 64,
        comment:
            "The address link of this notice, article or message or comment",
    })
    link: string;

    @ApiProperty()
    @Column({
        default: false,
        comment: "Whether the notice was read by admin.",
    })
    read: boolean;

    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    create: Date;
}
