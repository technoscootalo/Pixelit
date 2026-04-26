import bcrypt from "bcrypt";

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

(async () => {
    const hash = await hashPassword("ENTER YOUR PASSWORD HERE");
    console.log(hash);

    const isValid = await validatePassword("ENTER YOUR PASSWORD HERE", hash);
    console.log("Password matches:", isValid);
})();