import React from "react";
//please get this json from our github repo
import items from "../../mockData/items.json";
// import ItemList from "../itemList/ItemList";
import Item from "../item/Item";
import { Link } from "react-router-dom";
import './Home.css';

function HomePage() {
   
  return (
    <section>
      <div className="item-list">
      {items.map((item) => (
        <Link to={`/item/${item.id}`} key={item.id}>
          <Item
            name={item.name}
            rating={item.rating}
            price={item.price}
            saleDiscount={item.saleDiscount}
            image={item.image}
            brand={item.brand}
          />
        </Link>
      ))}
      </div>
    </section>
  );
}

export default HomePage;
