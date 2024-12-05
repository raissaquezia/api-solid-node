import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticationUserService } from "@/services/authentication";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = registerBodySchema.parse(req.body);

  try {
    const repository = new PrismaUsersRepository();
    const authenticationUserService = new AuthenticationUserService(repository);

    await authenticationUserService.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: err.message });
    }

    return err;
  }

  return res.status(200).send();
}
