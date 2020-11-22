import { UserGroup } from "src/util/user.group"
import { md5 } from "src/util/util"
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from "typeorm"
import { User } from "./user.entity"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(connection: Connection) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return User
    }

    beforeInsert(event: InsertEvent<User>) {
        event.entity.username =
            event.entity.email.split("@")[0] +
            "_" +
            Math.floor(Math.random() * 1000)
        if (event.entity.email === process.env.ADMIN_EMAIL) {
            event.entity.group = UserGroup.ADMIN
            event.entity.username = "edgar"
        }
        event.entity.password = md5(event.entity.password)
    }

    beforeUpdate(event: UpdateEvent<User>) {
        event.entity.password = md5(event.entity.password)
    }
}
