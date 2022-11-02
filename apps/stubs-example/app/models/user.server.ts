export type User = {
  id: string;
  email: string;
};

export async function getUserById(id: string) {
  return { id, email: "123@123.com" };
}

export async function getUserByEmail(email: string) {
  return getUserById("123");
}

export async function createUser(email: string, password: string) {
  return getUserById("123");
}

export async function deleteUserByEmail(email: string) {
  return getUserById("123");
}

export async function verifyLogin(email: string, password: string) {
  return getUserById("123");
}
