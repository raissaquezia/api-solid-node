import { hash } from "bcrypt";
import { UsersRepository } from "@/repositories/users-repository";
import { EmailAlreadyExistsError } from "@/services/errors/email-already-exists-error";

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserService {
  constructor(private userRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.userRepository.findUserByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError();
    }

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    });

    return user;
  }
}
