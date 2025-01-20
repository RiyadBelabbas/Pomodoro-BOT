const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Remplacez ces valeurs par vos propres configurations dans un fichier .env ou directement ici
const POMODORO_WORK_TIME = 45 * 60 * 1000; // 45 minutes en millisecondes
const POMODORO_BREAK_TIME = 10 * 60 * 1000; // 10 minutes en millisecondes
const pomodoroChannelId = 'VOTRE_CHANNEL_ID'; // Remplacez par l'ID de votre salon vocal Pomodoro
const pomodoroTextChannelId = 'VOTRE_TEXT_CHANNEL_ID'; // Remplacez par l'ID de votre salon de texte Pomodoro

let pomodoroInterval;
let currentVoiceConnection;
let player = createAudioPlayer();

// Fonction pour envoyer l'embed explicatif
async function sendPomodoroEmbed(channel, user) {
    const embed = new EmbedBuilder()
        .setTitle('🌟 Mode Pomodoro Activé 🌟')
        .setDescription(`Salut <@${user.id}>, bienvenue dans le mode Pomodoro ! 🌸 Voici comment ça fonctionne :

🕒 **45 minutes de travail concentré**  
🍃 **10 minutes de pause bien méritée**

🎶 Le bot jouera un signal sonore pour indiquer les changements de phase. Profite bien de ton temps et reste concentré ! 💪

N'oublie pas de prendre soin de toi pendant les pauses ! 😎

🎧 **Envie d'écouter de la musique ?**  
Utilise la commande **!spotify [URL de playlist]** pour écouter ta playlist Spotify préférée pendant tes sessions Pomodoro. 🎶🎵

N'oublie pas de rester concentré, mais aussi de t'amuser ! 🎉

Bot Pomodoro - Garde le rythme ! ⏰  
*Aujourd’hui à ${new Date().toLocaleTimeString()}*`)
        .setColor('#00FF00')
        .setFooter({ text: 'Bonne productivité ! 🚀' });

    await channel.send({ content: `<@${user.id}>`, embeds: [embed] });
}

// Fonction pour jouer le son de travail lorsque le bot rejoint le salon vocal
async function playWorkSignal(voiceChannel) {
    try {
        // Création du flux audio à partir du fichier mp3 directement
        const resource = createAudioResource('./sounds/work-signal.mp3', {
            inputType: 'unknown' // Spécifie que c'est un fichier audio sans type particulier
        });
        
        player.play(resource);

        // Retarder la lecture du son de 1 seconde après la connexion
        setTimeout(() => {
            currentVoiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });

            currentVoiceConnection.subscribe(player);
        }, 1000); // 1 seconde de délai
    } catch (error) {
        console.error("Erreur lors de la lecture du signal sonore :", error);
    }
}

// Fonction pour gérer les phases de Pomodoro
function startPomodoro(voiceChannel) {
    let isWorkPhase = true;

    pomodoroInterval = setInterval(() => {
        const sound = isWorkPhase ? 'work-signal.mp3' : 'break-signal.mp3';
        const resource = createAudioResource(`./sounds/${sound}`, {
            inputType: 'unknown' // On spécifie à nouveau que c'est un fichier mp3
        });
        player.play(resource);

        if (isWorkPhase) {
            console.log('Travail terminé, pause commence.');
        } else {
            console.log('Pause terminée, travail commence.');
        }

        isWorkPhase = !isWorkPhase;
    }, isWorkPhase ? POMODORO_WORK_TIME : POMODORO_BREAK_TIME);

    currentVoiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    currentVoiceConnection.subscribe(player);
}

// Gestion des événements
client.on('voiceStateUpdate', async (oldState, newState) => {
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;

    if (newUserChannel && newUserChannel.id === pomodoroChannelId && (!oldUserChannel || oldUserChannel.id !== pomodoroChannelId)) {
        const textChannel = await client.channels.fetch(pomodoroTextChannelId);
        await sendPomodoroEmbed(textChannel, newState.member.user);
        
        // Jouer le son lorsque le bot rejoint le salon vocal
        playWorkSignal(newUserChannel);
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!spotify')) {
        const args = message.content.split(' ');
        const playlistUrl = args[1];

        if (!playlistUrl) {
            return message.reply('Veuillez fournir une URL de playlist Spotify.');
        }

        if (!currentVoiceConnection) {
            return message.reply('Le bot doit être dans un salon vocal pour jouer de la musique.');
        }

        const playlist = await playdl.spotify(playlistUrl);

        for (const track of playlist.tracks) {
            const stream = await playdl.stream(track.url);
            const resource = createAudioResource(stream.stream, { inputType: stream.type });
            player.play(resource);

            await new Promise((resolve) => {
                player.once(AudioPlayerStatus.Idle, resolve);
            });
        }

        message.reply('Playlist terminée !');
    }
});

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

// Remplacez par votre token dans le fichier .env
client.login(process.env.TOKEN);
