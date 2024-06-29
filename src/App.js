import useData from './data';
import SearchBar from './SearchBar'
import Media from './Media'
import './App.css';
import { useState } from 'react'
import Box from '@mui/material/Box'

function App() {
  const results = useData();
  const [search, setSearch] = useState("");

  return (
    <div className="App">
      <SearchBar onChange={(e) => setSearch(e.target.value)} value={search} />
      <Box sx={{ padding: 5 }}>
        <Media data={results.data} search={search.toLowerCase()} error={results.error} />
      </Box>
    </div>
  );
}

export default App;
