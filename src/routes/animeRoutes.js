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
  addSeason,
  updateSeason,
  deleteSeason,
  addEpisode,
  updateEpisode,
  deleteEpisode,
} from '../controllers/animeController.js';

const router = express.Router();

router.get('/', listAnimes);
router.post('/', createAnime);
router.get('/:id', getAnime);
router.put('/:id', updateAnime);
router.delete('/:id', deleteAnime);

router.get('/:id/seasons', listSeasons);
router.post('/:id/seasons', addSeason);
router.get('/:id/seasons/:seasonNumber', getSeason);
router.put('/:id/seasons/:seasonNumber', updateSeason);
router.delete('/:id/seasons/:seasonNumber', deleteSeason);

router.post('/:id/seasons/:seasonNumber/episodes', addEpisode);
router.get('/:id/seasons/:seasonNumber/episodes/:episodeNumber', getEpisode);
router.put('/:id/seasons/:seasonNumber/episodes/:episodeNumber', updateEpisode);
router.delete('/:id/seasons/:seasonNumber/episodes/:episodeNumber', deleteEpisode);

export default router;
