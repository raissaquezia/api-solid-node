import { describe, expect, it } from "vitest";
import { RegisterUserService } from "@/services/register";
import { compare, hash } from "bcryptjs";
import { UserInMemoryRepository } from "@/repositories/in-memory-repositories/user-in-memory-repository";
import { EmailAlreadyExistsError } from "@/services/errors/email-already-exists-error";
import { AuthenticationUserService } from "@/services/authentication";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";

describe("Authentication service", () => {
  it("should be able to authenticate", async () => {
    const userInMemory = new UserInMemoryRepository();
    const authenticationUserService = new AuthenticationUserService(
      userInMemory,
    );

    await userInMemory.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await authenticationUserService.execute({
      email: "john@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not authenticate with wrong email", async () => {
    const userInMemory = new UserInMemoryRepository();
    const authenticationUserService = new AuthenticationUserService(
      userInMemory,
    );

    expect(
      authenticationUserService.execute({
        email: "john@example.com",
        password: "1234567",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not authenticate with wrong password", async () => {
    const userInMemory = new UserInMemoryRepository();
    const authenticationUserService = new AuthenticationUserService(
      userInMemory,
    );

    await userInMemory.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: await hash("123456", 6),
    });

    expect(
      authenticationUserService.execute({
        email: "john@example.com",
        password: "1234567",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
