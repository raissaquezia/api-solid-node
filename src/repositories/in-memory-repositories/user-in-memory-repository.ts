import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "@/repositories/users-repository";

export class UserInMemoryRepository implements UsersRepository {
  public items: User[] = [];
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "user-id",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.items.push(user);
    return user;
  }
  async findUserByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
}
