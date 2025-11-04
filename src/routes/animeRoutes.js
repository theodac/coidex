import express from 'express';
import {
  listAnimes,
  getAnime,
  createAnime,
  updateAnime,
  deleteAnime,
  listSeasons,
  getSeason,
  getEpisode,
} from '../controllers/animeController.js';

const router = express.Router();

router.get('/', listAnimes);
router.post('/', createAnime);
router.get('/:id', getAnime);
router.put('/:id', updateAnime);
router.delete('/:id', deleteAnime);

router.get('/:id/seasons', listSeasons);
router.get('/:id/seasons/:seasonNumber', getSeason);
router.get('/:id/seasons/:seasonNumber/episodes/:episodeNumber', getEpisode);

export default router;
