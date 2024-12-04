import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterUserService } from "@/services/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { EmailAlreadyExistsError } from "@/services/errors/email-already-exists-error";

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const repository = new PrismaUsersRepository();
    const registerUserService = new RegisterUserService(repository);

    await registerUserService.execute({ name, email, password });
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return res.status(409).send({ message: err.message });
    }

    return err;
  }

  return res.status(201).send();
}
