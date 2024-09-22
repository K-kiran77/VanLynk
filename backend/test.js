import { hash, compare } from "bcrypt"

const passhash = async () => {
    const isPasswordValid = await compare("p123", "$2b$10$ms8FkGrOrjzkXRWLAy0Cm.0uD42LYhvDXXpEeNqe7gyr81S7CNqHO");
    console.log(isPasswordValid)
}
passhash()

console.log("hello")