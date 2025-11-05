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
