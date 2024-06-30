#!/usr/bin/env node

import fetch from "node-fetch";
import { URL } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) throw new Error("missing TMDB_API_KEY env var");

const sheets =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7dvqSw51S3mvcAfXcAqbwr04bwrMBPwnrSqbkSi_dUJ1MgkwxBthmZ3D_UIh1mcxt-Ade12ovvah_/pub?gid=2039265820&single=true&output=tsv";

const resp = await fetch(sheets);
const raw = await resp.text();

const lines = raw.split("\r\n");
const header = lines[0].split("\t");
const out = [];

for (var i = 1; i < lines.length; i++) {
  let row = lines[i].split("\t");
  row = parseRow(row, header);
  if (!row) continue;
  try {
    row = await enhance(row);
    if (row) out.push(row);
  } catch (e) {}
}

out.sort((a, b) => a.title.localeCompare(b.title));

await writeFile("public/movies.json", JSON.stringify(out));

function parseRow(row, columns) {
  const out = {};

  for (let column = 0; column < columns.length; column++) {
    let name = columns[column];
    let value = row[column];
    if (!value) return null;
    if (name === "iMDB Link") {
      let paths = new URL(value).pathname.split("/");
      out.imdb = paths[paths.length - 1];
    } else if (name === "Format") {
      out.dvd = value.includes("DVD");
      out.blu_ray = value.includes("Blu-ray");
    }
  }

  return out;
}

async function enhance(row) {
  const { movie_results, tv_episode_results } = await tmdb(row.imdb);

  if (movie_results && movie_results.length) {
    const movie = movie_results[0];
    row.type = 'movie'
    row.title = movie.title;
    row.image = imagePath(movie.poster_path);
    row.released = movie.release_date;
    row.tmdb = movie.id;
  } else if (tv_episode_results && tv_episode_results.length) {
    const episode = tv_episode_results[0];
    // TODO get show
    row.type = 'episode'
    row.title = `S${episode.season_number}:E${episode.episode_number} - ${episode.name}`;
    row.image = imagePath(episode.still_path);
    row.released = episode.air_date
    row.tmdb = episode.id;
  } else {
    return null;
  }

  return row;
}

function imagePath(path) {
  return `https://image.tmdb.org/t/p/original${path}`;
}

async function tmdb(id) {
  const cache = `build/cache/${id}.json`;
  try {
    const cached = await readFile(cache);
    return JSON.parse(cached);
  } catch (e) {}

  const url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const resp = await fetch(url);
  const text = await resp.text();
  const json = JSON.parse(text);

  try {
    await mkdir("build/cache", { recursive: true });
  } catch (e) {}

  await writeFile(cache, text);

  return json;
}
