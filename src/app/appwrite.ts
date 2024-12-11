import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6752c8f400130e7173da'); 

export const account = new Account(client);
export { ID } from 'appwrite';
