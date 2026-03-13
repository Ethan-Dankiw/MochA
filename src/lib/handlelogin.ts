"use server"

export async function loginUser(email: string, password: string) {
    console.log("Email:", email, "Password:", password)
  // Replace this with your real auth logic (database check, hashing, etc.)
  if (email === "test@1" && password === "123") {
    return { success: true, message: "Logged in!" }
  }

  return { success: false, message: "Invalid credentials" }
}