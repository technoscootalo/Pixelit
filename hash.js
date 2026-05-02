import bcrypt from "bcrypt";

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

(async () => {
    const hash = await hashPassword("test");
    console.log(hash);

    const isValid = await validatePassword("test", hash);
    console.log("Password matches:", isValid);
})();