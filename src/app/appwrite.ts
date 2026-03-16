// Importeer de benodigde Appwrite klassen voor de client en authenticatie
import { Client, Account } from 'appwrite';

// Maak een nieuwe Appwrite client instantie aan
export const client = new Client();

// Configureer de client met het Appwrite cloud endpoint en project ID
client
    .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite cloud API endpoint
    .setProject('6752c8f400130e7173da');           // Uniek project ID in Appwrite

// Exporteer het Account object voor authenticatiebeheer (inloggen, registreren, etc.)
export const account = new Account(client);

// Re-exporteer de ID helper van Appwrite voor het genereren van unieke identifiers
export { ID } from 'appwrite';
