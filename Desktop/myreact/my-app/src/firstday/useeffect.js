import { useEffect, useState } from "react";
const useEffecText = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => setList(data));
  }, []);

  return (
    <div>
      {list.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default useEffecText