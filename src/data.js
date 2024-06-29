import { useState, useEffect } from "react";

const URL = `${process.env.PUBLIC_URL}/movies.json`;

export default function useData() {
  const [error, setError] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    load().then(
      (res) => {
        setData(res);
      },
      (error) => {
        setError(error);
      }
    );
    return () => {};
  }, []);
  return { error, data };
}

function load() {
  return fetch(URL)
    .then((resp) => resp.json())
    .then(processResponse);
}

async function processResponse(rows) {
  rows.forEach((row) => {
    if (row.released) row.released = new Date(row.released);
    if (row.imdb) row.imdb_url = `https://www.imdb.com/title/${row.imdb}`;
  });
  return rows;
}
