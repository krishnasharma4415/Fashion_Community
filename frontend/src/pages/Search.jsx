import { useState } from "react";
import { searchPosts } from "../services/postService";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await searchPosts(query);
    setResults(data);
  };

  return (
    <div className="p-4">
      <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white p-1">Search</button>

      <div className="mt-4">
        {results.length > 0 ? results.map((post) => <div key={post.id}>{post.title}</div>) : <p>No results found</p>}
      </div>
    </div>
  );
};

export default Search;
