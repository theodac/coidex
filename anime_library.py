"""Anime library management module.

This module provides dataclasses and an ``AnimeLibrary`` helper that can
be used to register anime shows along with their seasons and episodes.
The library ensures that identifiers remain unique within an anime and
exposes methods to add, update, and delete the managed entities.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Optional


@dataclass
class Episode:
    """A single anime episode."""

    number: int
    title: str
    synopsis: Optional[str] = None
    air_date: Optional[str] = None
    duration_minutes: Optional[int] = None


@dataclass
class Season:
    """A season of an anime show."""

    number: int
    title: Optional[str] = None
    synopsis: Optional[str] = None
    episodes: Dict[int, Episode] = field(default_factory=dict)


@dataclass
class Anime:
    """An anime show tracked by the library."""

    id: int
    title: str
    synopsis: Optional[str] = None
    year: Optional[int] = None
    seasons: Dict[int, Season] = field(default_factory=dict)


class AnimeLibrary:
    """In-memory registry for anime, seasons, and episodes."""

    def __init__(self) -> None:
        self._next_anime_id = 1
        self._animes: Dict[int, Anime] = {}

    def add_anime(self, title: str, synopsis: Optional[str] = None, year: Optional[int] = None) -> Anime:
        """Register a new anime.

        Args:
            title: The anime name.
            synopsis: Optional summary of the show.
            year: Optional release year.

        Returns:
            The newly created :class:`Anime` object.
        """

        anime_id = self._next_anime_id
        self._next_anime_id += 1

        anime = Anime(id=anime_id, title=title, synopsis=synopsis, year=year)
        self._animes[anime_id] = anime
        return anime

    def get_anime(self, anime_id: int) -> Anime:
        try:
            return self._animes[anime_id]
        except KeyError as exc:
            raise KeyError(f"Anime with id {anime_id} does not exist") from exc

    def update_anime(self, anime_id: int, *, title: Optional[str] = None, synopsis: Optional[str] = None, year: Optional[int] = None) -> Anime:
        anime = self.get_anime(anime_id)

        if title is not None:
            anime.title = title
        if synopsis is not None:
            anime.synopsis = synopsis
        if year is not None:
            anime.year = year
        return anime

    def delete_anime(self, anime_id: int) -> None:
        if anime_id not in self._animes:
            raise KeyError(f"Anime with id {anime_id} does not exist")
        del self._animes[anime_id]

    def add_season(
        self,
        anime_id: int,
        number: int,
        *,
        title: Optional[str] = None,
        synopsis: Optional[str] = None,
    ) -> Season:
        anime = self.get_anime(anime_id)
        if number in anime.seasons:
            raise ValueError(f"Season {number} already exists for anime {anime_id}")

        season = Season(number=number, title=title, synopsis=synopsis)
        anime.seasons[number] = season
        return season

    def get_season(self, anime_id: int, season_number: int) -> Season:
        anime = self.get_anime(anime_id)
        try:
            return anime.seasons[season_number]
        except KeyError as exc:
            raise KeyError(
                f"Season {season_number} does not exist for anime {anime_id}"
            ) from exc

    def update_season(
        self,
        anime_id: int,
        season_number: int,
        *,
        title: Optional[str] = None,
        synopsis: Optional[str] = None,
    ) -> Season:
        season = self.get_season(anime_id, season_number)

        if title is not None:
            season.title = title
        if synopsis is not None:
            season.synopsis = synopsis
        return season

    def delete_season(self, anime_id: int, season_number: int) -> None:
        anime = self.get_anime(anime_id)
        if season_number not in anime.seasons:
            raise KeyError(
                f"Season {season_number} does not exist for anime {anime_id}"
            )
        del anime.seasons[season_number]

    def add_episode(
        self,
        anime_id: int,
        season_number: int,
        number: int,
        *,
        title: str,
        synopsis: Optional[str] = None,
        air_date: Optional[str] = None,
        duration_minutes: Optional[int] = None,
    ) -> Episode:
        season = self.get_season(anime_id, season_number)
        if number in season.episodes:
            raise ValueError(
                f"Episode {number} already exists for anime {anime_id} season {season_number}"
            )

        episode = Episode(
            number=number,
            title=title,
            synopsis=synopsis,
            air_date=air_date,
            duration_minutes=duration_minutes,
        )
        season.episodes[number] = episode
        return episode

    def get_episode(self, anime_id: int, season_number: int, episode_number: int) -> Episode:
        season = self.get_season(anime_id, season_number)
        try:
            return season.episodes[episode_number]
        except KeyError as exc:
            raise KeyError(
                f"Episode {episode_number} does not exist for anime {anime_id} season {season_number}"
            ) from exc

    def update_episode(
        self,
        anime_id: int,
        season_number: int,
        episode_number: int,
        *,
        title: Optional[str] = None,
        synopsis: Optional[str] = None,
        air_date: Optional[str] = None,
        duration_minutes: Optional[int] = None,
    ) -> Episode:
        episode = self.get_episode(anime_id, season_number, episode_number)

        if title is not None:
            episode.title = title
        if synopsis is not None:
            episode.synopsis = synopsis
        if air_date is not None:
            episode.air_date = air_date
        if duration_minutes is not None:
            episode.duration_minutes = duration_minutes
        return episode

    def delete_episode(self, anime_id: int, season_number: int, episode_number: int) -> None:
        season = self.get_season(anime_id, season_number)
        if episode_number not in season.episodes:
            raise KeyError(
                f"Episode {episode_number} does not exist for anime {anime_id} season {season_number}"
            )
        del season.episodes[episode_number]

    def list_animes(self) -> Dict[int, Anime]:
        """Return a shallow copy of the anime registry."""

        return dict(self._animes)
