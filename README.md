# Gestionnaire d'animes

Ce dépôt fournit un petit module Python qui permet de gérer une liste
d'animes ainsi que leurs saisons et épisodes. Le module
`anime_library.AnimeLibrary` s'occupe de :

- Ajouter, modifier et supprimer des animes.
- Ajouter, modifier et supprimer des saisons pour chaque anime.
- Ajouter, modifier et supprimer des épisodes pour chaque saison.
- Empêcher l'ajout de doublons sur les saisons et les épisodes.

## Prise en main rapide

```python
from anime_library import AnimeLibrary

library = AnimeLibrary()
anime = library.add_anime("One Piece", year=1999)
library.add_season(anime.id, 1, title="East Blue")
library.add_episode(anime.id, 1, 1, title="Romance Dawn")
```

## Tests

Les tests unitaires couvrent l'ajout, la modification et la suppression
des animes, saisons et épisodes.

```bash
python -m unittest discover
```
