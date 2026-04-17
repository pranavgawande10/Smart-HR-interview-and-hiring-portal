const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:3000/login', {
      email: 'axyz56455@gmail.com', // wait, I don't know the test user email
      password: 'password123',
      role: 'HR'
    });
    console.log(login.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
test();
