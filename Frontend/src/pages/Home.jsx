import { useEffect } from "react";
import api from "@/api/api";

const Home = () => {
  useEffect(() => {
    api.get("/resources")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <div>Home Page</div>;
};

export default Home;