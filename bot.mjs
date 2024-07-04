import pkg from 'discord.js';
import fetch from 'node-fetch';
import { readFile, writeFile } from 'fs/promises';

const { Client, GatewayIntentBits, Routes, REST, SlashCommandBuilder, EmbedBuilder } = pkg;

const TOKEN = '';
const CLIENT_ID = '';
const GUILD_ID = '';
const PASSWORDS_FILE = './passwords.json';
const API_URL = 'khudki password gen api banadi thi timepass me isliye normal password gen ki jagah api use karli';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Register the slash commands with the specific guild
const commands = [
    new SlashCommandBuilder()
        .setName('savepassword')
        .setDescription('Saves a password')
        .addStringOption(option => option.setName('site').setDescription('The site URL').setRequired(true))
        .addStringOption(option => option.setName('email').setDescription('The email address').setRequired(true))
        .addStringOption(option => option.setName('password').setDescription('The password').setRequired(true))
        .addStringOption(option => option.setName('tag').setDescription('A tag to categorize this password').setRequired(true)),
    new SlashCommandBuilder()
        .setName('viewpasswords')
        .setDescription('Displays all saved passwords'),
    new SlashCommandBuilder()
        .setName('generatepassword')
        .setDescription('Generates a random password using the API')
        .addIntegerOption(option => option.setName('length').setDescription('Length of the password').setRequired(false)),
    new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Fetches a password by tag')
        .addStringOption(option => option.setName('tag').setDescription('The tag of the password to fetch').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'savepassword') {
        const site = interaction.options.getString('site');
        const email = interaction.options.getString('email');
        const password = interaction.options.getString('password');
        const tag = interaction.options.getString('tag');

        const newPassword = { site, email, password, tag };

        try {
            const data = await readFile(PASSWORDS_FILE, 'utf8');
            const passwords = JSON.parse(data);
            passwords.push(newPassword);
            await writeFile(PASSWORDS_FILE, JSON.stringify(passwords, null, 2));
            await interaction.reply({ content: 'Password saved successfully.', ephemeral: true });
        } catch (error) {
            console.error('Error saving password:', error);
            await interaction.reply({ content: 'Sorry, there was an error saving the password.', ephemeral: true });
        }
    } else if (commandName === 'viewpasswords') {
        try {
            const data = await readFile(PASSWORDS_FILE, 'utf8');
            const passwords = JSON.parse(data);

            const embed = new EmbedBuilder()
                .setTitle('Saved Passwords')
                .setColor(0x00AE86);

            passwords.forEach((entry, index) => {
                embed.addFields({ name: `Entry ${index + 1}`, value: `**Site:** ${entry.site}\n**Email:** ${entry.email}\n**Password:** ${entry.password}\n**Tag:** ${entry.tag}` });
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error retrieving passwords:', error);
            await interaction.reply({ content: 'Sorry, there was an error retrieving the passwords.', ephemeral: true });
        }
    } else if (commandName === 'generatepassword') {
        const length = interaction.options.getInteger('length') || 12;

        try {
            const response = await fetch(`${API_URL}?length=${length}`);
            const data = await response.json();
            const password = data.password;
            await interaction.reply({ content: `Generated Password: ${password}`, ephemeral: true });
        } catch (error) {
            console.error('Error fetching password:', error);
            await interaction.reply({ content: 'Sorry, there was an error generating the password.', ephemeral: true });
        }
    } else if (commandName === 'tag') {
        const tag = interaction.options.getString('tag');

        try {
            const data = await readFile(PASSWORDS_FILE, 'utf8');
            const passwords = JSON.parse(data);
            const matchedPasswords = passwords.filter(entry => entry.tag === tag);

            if (matchedPasswords.length === 0) {
                await interaction.reply({ content: 'No passwords found for this tag.', ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`Passwords for tag: ${tag}`)
                .setColor(0x00AE86);

            matchedPasswords.forEach((entry, index) => {
                embed.addFields({ name: `Entry ${index + 1}`, value: `**Site:** ${entry.site}\n**Email:** ${entry.email}\n**Password:** ${entry.password}` });
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error retrieving passwords by tag:', error);
            await interaction.reply({ content: 'Sorry, there was an error retrieving the passwords.', ephemeral: true });
        }
    }
});

client.login(TOKEN);
