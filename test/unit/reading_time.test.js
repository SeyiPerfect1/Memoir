const readingTime = require('../../src/utils/reading_time');

test('generate json web token', async () => {
  const body =
    'wnfihwigrnnwkgnwnrvnwrngwnfjoo nckdwnfvwkrn wbwivshidsrhghjfwejfwhfnwvndkvnwei';
  const calcReadingTime = await readingTime(body);
  console.log(calcReadingTime);
  expect(calcReadingTime).toBe('1');
});
