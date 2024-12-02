// Example API call (replace with real data fetching logic)
fetch("/api/example")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data from API:", data);
  })
  .catch((error) => console.error("API call error:", error));
