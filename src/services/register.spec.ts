import { describe, expect, it } from "vitest";
import { RegisterUserService } from "@/services/register";
import { compare } from "bcryptjs";
import { UserInMemoryRepository } from "@/repositories/in-memory-repositories/user-in-memory-repository";
import { any } from "zod";
import { EmailAlreadyExistsError } from "@/services/errors/email-already-exists-error";

describe("Register service", () => {
  it("should register", async () => {
    const userInMemory = new UserInMemoryRepository();
    const registerUserService = new RegisterUserService(userInMemory);

    const user = await registerUserService.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password", async () => {
    const userInMemory = new UserInMemoryRepository();
    const registerUserService = new RegisterUserService(userInMemory);

    const user = await registerUserService.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to register the same email twice", async () => {
    const userInMemory = new UserInMemoryRepository();
    const registerUserService = new RegisterUserService(userInMemory);

    const user = await registerUserService.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    expect(
      registerUserService.execute({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
