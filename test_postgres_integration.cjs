import('./lib/api/user.cjs').then(({ getUser, getFirstUser, getAllUsers, searchUser, getUserCount, updateUser }) => {
  async function testGetUser() {
    console.log('Running testGetUser...');
    const username = 'testuser';
    const user = await getUser(username);
    console.log('getUser:', user);
  }

  async function testGetFirstUser() {
    console.log('Running testGetFirstUser...');
    const user = await getFirstUser();
    console.log('getFirstUser:', user);
  }

  async function testGetAllUsers() {
    console.log('Running testGetAllUsers...');
    const users = await getAllUsers();
    console.log('getAllUsers:', users);
  }

  async function testSearchUser() {
    console.log('Running testSearchUser...');
    const query = 'test';
    const users = await searchUser(query);
    console.log('searchUser:', users);
  }

  async function testGetUserCount() {
    console.log('Running testGetUserCount...');
    const count = await getUserCount();
    console.log('getUserCount:', count);
  }

  async function testUpdateUser() {
    console.log('Running testUpdateUser...');
    const username = 'testuser';
    const bio = 'This is a test bio.';
    const result = await updateUser(username, bio);
    console.log('updateUser:', result);
  }

  async function runTests() {
    await testGetUser();
    await testGetFirstUser();
    await testGetAllUsers();
    await testSearchUser();
    await testGetUserCount();
    await testUpdateUser();
  }

  runTests().catch(console.error);
});
