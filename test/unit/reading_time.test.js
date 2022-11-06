const readingTime = require("../../src/utils/reading_time");

test("generate json web token", async () => {
  const body =
    "wnfihwigrnnwkgnwnrvnwrngwnfjoo nckdwnfvwkrn wbwivshidsrhghjfwejfwhfnwvndkvnwei";
  const reading_time = await readingTime(body);
  console.log(reading_time);
  expect(reading_time).toBe("1");
});
