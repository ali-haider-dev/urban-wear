import React from "react";
//please get this json from our github repo
import items from "../../mockData/items.json";
import ItemList from "../itemList/ItemList";


function HomePage() {
    console.log("items,>>>>>>",items)
  return (
    <section>
      <ItemList items={items} />
    </section>
  );
}

export default HomePage;
