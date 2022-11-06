const jwt = require("jsonwebtoken");

test("generate json web token", async () => {
    const payload = { id: "60gfuegjeih3i83yr82jf", email: "john_doe@gmail.com"};
    const token =  jwt.sign(payload, "hrfirh43ty4hi43");
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(10);
    expect(token.split(".").length).toBe(3);
})

test("verify json web token", async () => {
    const payload = { id: "60gfuegjeih3i83yr82jf", email: "john_doe@gmail.com"};
    const token =  jwt.sign(payload, "ihwrif348yrgj39pu");
    const decoded =  jwt.decode(token.toString());
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);

})

