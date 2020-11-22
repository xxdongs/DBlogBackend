import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindConditions, Repository } from "typeorm"
import { UserCreateDto, UserUpdateDto } from "./user.dto"
import { User } from "./user.entity"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findOne(cond: FindConditions<User>): Promise<User> {
        return await this.userRepository.findOne(cond)
    }

    async find(): Promise<[User[], number]> {
        return await this.userRepository.findAndCount({
            select: ["id", "username", "email", "avatar", "gender", "city"],
        })
    }

    async deleteOne(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id)
        return result.affected > 0
    }

    async insertOne(dto: UserCreateDto): Promise<boolean> {
        const one = await this.userRepository.findOne({ email: dto.email })
        if (one) return false
        const user = new User()
        user.email = dto.email
        user.password = dto.password
        await this.userRepository.insert(user)
        return true
    }

    async updateOne(id: number, dto: UserUpdateDto): Promise<boolean> {
        const result = await this.userRepository.update(id, dto)
        return result.affected > 0
    }
}
