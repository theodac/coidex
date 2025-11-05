import { Anime } from '../models/Anime.js';

export async function listAnimes(req, res, next) {
  try {
    const animes = await Anime.find().select('title imageUrl seasonCount episodesPerSeason publishedBy');
    res.json(animes);
  } catch (error) {
    next(error);
  }
}

export async function getAnime(req, res, next) {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json(anime);
  } catch (error) {
    next(error);
  }
}

async function findAnimeOr404(id, res) {
  const anime = await Anime.findById(id);
  if (!anime) {
    res.status(404).json({ message: 'Anime not found' });
    return null;
  }
  return anime;
}

export async function createAnime(req, res, next) {
  try {
    const anime = await Anime.create(req.body);
    res.status(201).json(anime);
  } catch (error) {
    next(error);
  }
}

export async function updateAnime(req, res, next) {
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json(anime);
  } catch (error) {
    next(error);
  }
}

export async function deleteAnime(req, res, next) {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listSeasons(req, res, next) {
  try {
    const anime = await Anime.findById(req.params.id).select('seasons title');
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json(anime.seasons);
  } catch (error) {
    next(error);
  }
}

export async function getSeason(req, res, next) {
  try {
    const anime = await Anime.findById(req.params.id).select('seasons title');
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    const seasonNumber = Number(req.params.seasonNumber);
    const season = anime.seasons.find((s) => s.number === seasonNumber);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    res.json(season);
  } catch (error) {
    next(error);
  }
}

export async function getEpisode(req, res, next) {
  try {
    const anime = await Anime.findById(req.params.id).select('seasons title');
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    const seasonNumber = Number(req.params.seasonNumber);
    const episodeNumber = Number(req.params.episodeNumber);

    const season = anime.seasons.find((s) => s.number === seasonNumber);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const episode = season.episodes.find((e) => e.number === episodeNumber);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    const episodeData = typeof episode.toObject === 'function' ? episode.toObject() : episode;

    res.json({
      anime: anime.title,
      season: season.number,
      ...episodeData,
    });
  } catch (error) {
    next(error);
  }
}

export async function addSeason(req, res, next) {
  try {
    const anime = await findAnimeOr404(req.params.id, res);
    if (!anime) return;

    const { number, episodes = [] } = req.body;

    if (number === undefined) {
      return res.status(400).json({ message: 'Season number is required' });
    }

    if (anime.seasons.some((season) => season.number === number)) {
      return res.status(409).json({ message: 'Season already exists' });
    }

    anime.seasons.push({ number, episodes });
    anime.seasonCount = anime.seasons.length;
    await anime.save();

    const createdSeason = anime.seasons.find((season) => season.number === number);
    res.status(201).json(createdSeason);
  } catch (error) {
    next(error);
  }
}

export async function updateSeason(req, res, next) {
  try {
    const anime = await findAnimeOr404(req.params.id, res);
    if (!anime) return;

    const seasonNumber = Number(req.params.seasonNumber);
    const seasonIndex = anime.seasons.findIndex((season) => season.number === seasonNumber);
    if (seasonIndex === -1) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const updates = req.body;
    if (
      updates.number !== undefined &&
      updates.number !== seasonNumber &&
      anime.seasons.some((season) => season.number === updates.number)
    ) {
      return res.status(409).json({ message: 'Another season already has this number' });
    }

    const currentSeason = anime.seasons[seasonIndex];
    const baseSeason =
      typeof currentSeason.toObject === 'function' ? currentSeason.toObject() : currentSeason;
    const updatedSeason = {
      ...baseSeason,
      ...updates,
    };

    anime.set(`seasons.${seasonIndex}`, updatedSeason);
    anime.seasonCount = anime.seasons.length;
    await anime.save();

    res.json(anime.seasons[seasonIndex]);
  } catch (error) {
    next(error);
  }
}

export async function deleteSeason(req, res, next) {
  try {
    const anime = await findAnimeOr404(req.params.id, res);
    if (!anime) return;

    const seasonNumber = Number(req.params.seasonNumber);
    const seasonIndex = anime.seasons.findIndex((season) => season.number === seasonNumber);
    if (seasonIndex === -1) {
      return res.status(404).json({ message: 'Season not found' });
    }

    anime.seasons.splice(seasonIndex, 1);
    anime.seasonCount = anime.seasons.length;
    await anime.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function addEpisode(req, res, next) {
  try {
    const anime = await findAnimeOr404(req.params.id, res);
    if (!anime) return;

    const seasonNumber = Number(req.params.seasonNumber);
    const season = anime.seasons.find((s) => s.number === seasonNumber);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const { number, title, videoUrl } = req.body;
    if (number === undefined || !title || !videoUrl) {
      return res.status(400).json({ message: 'Episode number, title, and videoUrl are required' });
    }

    if (season.episodes.some((episode) => episode.number === number)) {
      return res.status(409).json({ message: 'Episode already exists' });
    }

    season.episodes.push({ number, title, videoUrl });
    anime.markModified('seasons');
    await anime.save();

    const createdEpisode = season.episodes.find((episode) => episode.number === number);
    res.status(201).json(createdEpisode);
  } catch (error) {
    next(error);
  }
}

export async function updateEpisode(req, res, next) {
  try {
    const anime = await findAnimeOr404(req.params.id, res);
    if (!anime) return;

    const seasonNumber = Number(req.params.seasonNumber);
    const episodeNumber = Number(req.params.episodeNumber);

    const seasonIndex = anime.seasons.findIndex((season) => season.number === seasonNumber);
    if (seasonIndex === -1) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const episodeIndex = anime.seasons[seasonIndex].episodes.findIndex(
      (episode) => episode.number === episodeNumber,
    );
    if (episodeIndex === -1) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    const updates = req.body;
    if (
      updates.number !== undefined &&
      updates.number !== episodeNumber &&
      anime.seasons[seasonIndex].episodes.some((episode) => episode.number === updates.number)
    ) {
      return res
        .status(409)
        .json({ message: 'Another episode already uses this number in the season' });
    }

    const currentEpisode = anime.seasons[seasonIndex].episodes[episodeIndex];
    const baseEpisode =
      typeof currentEpisode.toObject === 'function' ? currentEpisode.toObject() : currentEpisode;
    const updatedEpisode = {
      ...baseEpisode,
      ...updates,
    };

    anime.set(`seasons.${seasonIndex}.episodes.${episodeIndex}`, updatedEpisode);
    await anime.save();

    res.json(anime.seasons[seasonIndex].episodes[episodeIndex]);
  } catch (error) {
    next(error);
  }
}

export async function deleteEpisode(req, res, next) {
  try {
    const anime = await findAnimeOr404(req.params.id, res);
    if (!anime) return;

    const seasonNumber = Number(req.params.seasonNumber);
    const episodeNumber = Number(req.params.episodeNumber);

    const seasonIndex = anime.seasons.findIndex((season) => season.number === seasonNumber);
    if (seasonIndex === -1) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const season = anime.seasons[seasonIndex];
    const episodeIndex = season.episodes.findIndex((episode) => episode.number === episodeNumber);
    if (episodeIndex === -1) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    season.episodes.splice(episodeIndex, 1);
    anime.markModified('seasons');
    await anime.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
