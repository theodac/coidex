# API Anime Express + MongoDB

Cette API Node.js/Express permet de gérer un catalogue d'animes stocké dans MongoDB. Elle prend en charge la consultation, l'ajout, la modification et la suppression d'animes, ainsi que la navigation par saisons et épisodes avec un lien vidéo pour chaque épisode.

## Prérequis

- Node.js 18+
- Une instance MongoDB accessible (locale ou distante)

## Installation

```bash
npm install
```

Créez un fichier `.env` à la racine du projet si vous souhaitez personnaliser la connexion :

```
MONGODB_URI=mongodb://localhost:27017/anime_db
PORT=3000
```

## Démarrer le serveur

```bash
npm start
```

ou en mode développement (redémarrage automatique) :

```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000` par défaut.

## Modèle d'un anime

```json
{
  "title": "One Piece",
  "imageUrl": "https://example.com/one-piece.jpg",
  "seasonCount": 2,
  "episodesPerSeason": 12,
  "videoTrailerUrl": "https://example.com/trailer.mp4",
  "publishedBy": "Eiichiro Oda",
  "seasons": [
    {
      "number": 1,
      "episodes": [
        {
          "number": 1,
          "title": "L'aventure commence",
          "videoUrl": "https://example.com/s1e1.mp4"
        }
      ]
    }
  ]
}
```

## Routes principales

- `GET /animes` — liste des animes.
- `POST /animes` — ajoute un anime.
- `GET /animes/:id` — détail d'un anime.
- `PUT /animes/:id` — modifie un anime.
- `DELETE /animes/:id` — supprime un anime.

### Navigation par saisons et épisodes

- `GET /animes/:id/seasons` — liste les saisons d'un anime.
- `GET /animes/:id/seasons/:seasonNumber` — détail d'une saison.
- `GET /animes/:id/seasons/:seasonNumber/episodes/:episodeNumber` — récupère un épisode avec son lien vidéo.

Chaque anime stocke également l'information `publishedBy` pour savoir qui l'a publié.
