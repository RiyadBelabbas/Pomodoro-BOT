# Pomodoro Bot pour Discord 🎧📅

Un bot Discord simple mais puissant qui vous aide à suivre la méthode **Pomodoro** pour améliorer votre productivité tout en vous amusant avec un peu de musique ! 🚀🎶

## 📜 Fonctionnalités

Le **Pomodoro Bot** est conçu pour gérer la méthode de gestion du temps Pomodoro, et ajouter des fonctionnalités supplémentaires pour rendre votre expérience plus agréable.

### 📅 Mode Pomodoro
- **45 minutes de travail** suivies de **10 minutes de pause**.
- Pendant chaque transition, un signal sonore est joué pour vous alerter.
- Le bot rejoint automatiquement un salon vocal dédié pour vous accompagner.
- Lorsque vous rejoignez le salon, un message d'annonce est envoyé dans un salon textuel associé.
- Le bot peut quitter automatiquement le salon vocal s'il n'y a plus de membres après 30 secondes.

### 🎶 Écoutez de la musique avec Spotify
- Le bot peut jouer des playlists Spotify directement dans votre salon vocal.
- Utilisez la commande `!spotify <URL>` pour jouer une playlist de votre choix.

### 💬 Annonces et Interactions
- Le bot envoie un **embed** visuel et interactif pour vous guider tout au long de votre session Pomodoro.
- Le bot est interactif et vous envoie des messages personnalisés, avec des emojis pour rendre l'expérience plus chaleureuse.

### 🖥️ Commandes

| Commande               | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `!start`               | Lance une session Pomodoro avec des notifications dans un salon vocal.      |
| `!stop`                | Arrête la session Pomodoro en cours.                                         |
| `!spotify <URL>`       | Joue une playlist Spotify dans le salon vocal actuel.                       |
| `!help`                | Affiche une liste des commandes disponibles.                                |

## 🧩 Installation

### Prérequis
1. **Node.js** : Assurez-vous que vous avez [Node.js](https://nodejs.org/) installé sur votre machine.
2. **FFmpeg** : Le bot utilise **FFmpeg** pour la gestion de l'audio. Vous devez l'installer sur votre système. Voir les instructions ci-dessous.

### Étapes pour installer FFmpeg sur Windows :
1. Téléchargez FFmpeg depuis le site officiel : [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html).
2. Extraire le fichier téléchargé dans un dossier (par exemple, `C:\ffmpeg`).
3. Ajoutez le dossier `bin` de FFmpeg à votre PATH dans les variables d'environnement de votre système (ex : `C:\ffmpeg\bin`).
4. Vérifiez l'installation en exécutant `ffmpeg -version` dans un terminal. 

### Installation du Bot

1. Clonez ce dépôt dans votre machine locale :
   ```bash
   git clone https://github.com/<votre-nom-utilisateur>/pomodoro-bot.git
