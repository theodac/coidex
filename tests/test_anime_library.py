import unittest

from anime_library import AnimeLibrary


class AnimeLibraryTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.library = AnimeLibrary()
        self.anime = self.library.add_anime("Fullmetal Alchemist", year=2003)

    def test_add_season_and_episode(self):
        season = self.library.add_season(self.anime.id, 1, title="Season 1")
        self.assertEqual(season.number, 1)

        episode = self.library.add_episode(
            self.anime.id,
            season.number,
            1,
            title="A New Beginning",
            synopsis="The brothers seek the philosopher's stone.",
        )
        self.assertEqual(episode.number, 1)
        self.assertEqual(episode.title, "A New Beginning")

    def test_update_entities(self):
        self.library.add_season(self.anime.id, 1)
        self.library.add_episode(self.anime.id, 1, 1, title="Pilot")

        updated_anime = self.library.update_anime(self.anime.id, title="FMA")
        self.assertEqual(updated_anime.title, "FMA")

        updated_season = self.library.update_season(self.anime.id, 1, title="Brotherhood")
        self.assertEqual(updated_season.title, "Brotherhood")

        updated_episode = self.library.update_episode(
            self.anime.id,
            1,
            1,
            title="The Beginning",
            synopsis="Updated synopsis",
            duration_minutes=24,
        )
        self.assertEqual(updated_episode.title, "The Beginning")
        self.assertEqual(updated_episode.synopsis, "Updated synopsis")
        self.assertEqual(updated_episode.duration_minutes, 24)

    def test_delete_entities(self):
        self.library.add_season(self.anime.id, 1)
        self.library.add_episode(self.anime.id, 1, 1, title="Pilot")

        self.library.delete_episode(self.anime.id, 1, 1)
        with self.assertRaises(KeyError):
            self.library.get_episode(self.anime.id, 1, 1)

        self.library.delete_season(self.anime.id, 1)
        with self.assertRaises(KeyError):
            self.library.get_season(self.anime.id, 1)

        self.library.delete_anime(self.anime.id)
        with self.assertRaises(KeyError):
            self.library.get_anime(self.anime.id)

    def test_prevent_duplicate_seasons_and_episodes(self):
        self.library.add_season(self.anime.id, 1)
        with self.assertRaises(ValueError):
            self.library.add_season(self.anime.id, 1)

        self.library.add_episode(self.anime.id, 1, 1, title="Pilot")
        with self.assertRaises(ValueError):
            self.library.add_episode(self.anime.id, 1, 1, title="Duplicate")


if __name__ == "__main__":
    unittest.main()
