import { getUser, getFirstUser, getAllUsers, searchUser, getUserCount, updateUser } from './lib/api/user.js';

async function testGetUser() {
  const username = 'testuser';
  const user = await getUser(username);
  console.log('getUser:', user);
}

async function testGetFirstUser() {
  const user = await getFirstUser();
  console.log('getFirstUser:', user);
}

async function testGetAllUsers() {
  const users = await getAllUsers();
  console.log('getAllUsers:', users);
}

async function testSearchUser() {
  const query = 'test';
  const users = await searchUser(query);
  console.log('searchUser:', users);
}

async function testGetUserCount() {
  const count = await getUserCount();
  console.log('getUserCount:', count);
}

async function testUpdateUser() {
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
