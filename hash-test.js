const { hashPassword } = require('@better-auth/utils/password');

async function test() {
  const hash = await hashPassword('Admin@123456');
  console.log('Hash:', hash);
}
test().catch(console.error);
