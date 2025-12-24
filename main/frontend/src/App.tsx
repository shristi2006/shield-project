import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    axios.get("http://localhost:8000")
      .then(res => setMessage(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>MERN + TS</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
