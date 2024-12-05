import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { compare, hash } from "bcrypt";

interface AuthenticationRequest {
  email: string;
  password: string;
}

interface AuthenticationResponse {
  user: User;
}

export class AuthenticationUserService {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticationRequest): Promise<AuthenticationResponse> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMacth = await compare(password, user.password_hash);

    if (!doesPasswordMacth) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
