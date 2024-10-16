import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [dogHistory, setDogHistory] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [currDog, setCurrDog] = useState(null);
  const [banList, setBanList] = useState([]);

  useEffect(() => {
    async function getDogs() {
      try {
        const response = await fetch(
          "https://api.thedogapi.com/v1/images/search?has_breeds=true&limit=1000",
          {
            headers: {
              "x-api-key":
                "live_3MmU5nvSzZ7zvJc9u1TQa1GvH9nV6fULLC6rhLFHGvkI1SZOszH2jeUpc5q2Lozc",
            },
          }
        );
        const data = await response.json();
        const filteredDogs = data.filter(dog => dog.breeds && dog.breeds.length > 0 && dog.breeds[0].origin);
        setDogs(filteredDogs);
      } catch (err) {
        console.error("Error fetching dogs:", err);
      }
    }
    getDogs();
  }, []);

  function discoverDog() {
    if (dogs.length === 0) return;
    const availableDogs = dogs.filter(dog => !banList.includes(dog.breeds[0].origin));
    if (availableDogs.length === 0) {
      alert("No more dogs available! Please unban some origins.");
      return;
    }
    const randomDog = availableDogs[Math.floor(Math.random() * availableDogs.length)];
    setCurrDog(randomDog);
    setDogHistory(prevHistory => [
      ...prevHistory, 
      {
        url: randomDog.url,
        description: `A ${randomDog.breeds[0]?.breed_group || ""} dog from ${randomDog.breeds[0]?.origin || "an unknown origin"}`
      }
    ]);
  }

  function addToBanList(origin) {
    if (!banList.includes(origin)) {
      setBanList([...banList, origin]);
    }
  }

  function removeFromBanList(origin) {
    setBanList(banList.filter(bannedOrigin => bannedOrigin !== origin));
  }

  return (
    <div className='containers'>
      <div className="dog-container">
        <h2>Who have we seen so far?</h2>
        {dogHistory.map((dog, index) => (
          <div key={index}>
            <img src={dog.url} alt={`Dog ${index + 1}`} />
            <p>{dog.description}</p>
          </div>
        ))}
      </div>

      <div className="discover-container">
        <h1>Dog Mania</h1>
        <p>Check out these cool dogs!</p>
        {currDog && (
          <div className="dog-card">
            <div className="dog-attributes">
              <span>{currDog.breeds[0]?.breed_group || "Not Available"}</span>
              <span>{currDog.breeds[0]?.weight.imperial || "Unknown"} lbs</span>
              <button onClick={() => addToBanList(currDog.breeds[0]?.origin)}>
                {currDog.breeds[0]?.origin || "Unknown Origin"}
              </button>
              <span>{currDog.breeds[0]?.life_span || "Unknown Lifespan"}</span>
            </div>
            <div className="dog-image">
              <img src={currDog.url} alt="Current dog" />
            </div>
          </div>
        )}
        <button onClick={discoverDog}>Discover</button>
      </div>

      <div className="ban-container">
        <h2>Banned Origins</h2>
        <ul>
          {banList.map((origin, index) => (
            <li key={index}>
              {origin}
              <button onClick={() => removeFromBanList(origin)}>Unban</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;