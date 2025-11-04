import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { _id: false }
);

const SeasonSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    episodes: { type: [EpisodeSchema], default: [] },
  },
  { _id: false }
);

const AnimeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    seasonCount: { type: Number, required: true, min: 1 },
    episodesPerSeason: { type: Number, required: true, min: 1 },
    videoTrailerUrl: { type: String },
    seasons: { type: [SeasonSchema], default: [] },
    publishedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Anime = mongoose.model('Anime', AnimeSchema);
