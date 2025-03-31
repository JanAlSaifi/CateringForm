"use client";
import { useState } from "react";

export default function Home() {
  const [buttonMode, setButtonMode] = useState("mesa");
  const [selectedMesa, setSelectedMesa] = useState("tenMesa");
  const [selectedDishes, setSelectedDishes] = useState([]);

  const [counts, setCounts] = useState({
    vegetarisch: 0,
    beiti: 0,
  });

  const dishes = [
    "Hummus",
    "Tabouleh",
    "Labneh",
    "Walnuss-Paprika-Paste",
    "Kartoffeln",
    "Auberginen",
    "Blumenkohl",
    "Schneidebohnen",
    "Rote-Beete-Salat",
    "Olivensalat",
    "Bohnen",
    "Karotten",
    "Kichererbsen-Salat",
    "Saubohnen",
    "Spinat",
    "Okraschoten",
    "Kohlrabi",
    "Artischockensalat",
    "Moussaka",
    "Kartoffeln frittiert",
    "Auberginenmus",
    "Linsensalat",
    "Bulgur",
  ];

  const add = (menuType) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [menuType]: prevCounts[menuType] + 1,
    }));
  };

  const sub = (menuType) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [menuType]: Math.max(0, prevCounts[menuType] - 1),
    }));
  };

  const handleMesaSelect = (value) => {
    setSelectedMesa(value);
    setSelectedDishes([]);
  };

  const handleDishSelect = (dish) => {
    if (selectedDishes.includes(dish)) {
      setSelectedDishes(selectedDishes.filter((item) => item !== dish));
    } else if (
      selectedDishes.length < (selectedMesa === "eightMesa" ? 8 : 10)
    ) {
      setSelectedDishes([...selectedDishes, dish]);
    }
  };

  return (
    <div className="grid items-center justify-items-center p-8 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <div className="flex gap-6 items-center sm:items-start text-5xl ">
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-4 rounded-lg"
          onClick={() => setButtonMode("mesa")}
        >
          Mesa
        </button>
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-4 rounded-lg"
          onClick={() => setButtonMode("menü")}
        >
          Menü
        </button>
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-4 rounded-lg"
          onClick={() => setButtonMode("fingerfood")}
        >
          FingerFood
        </button>
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-4 rounded-lg"
          onClick={() => setButtonMode("optionen")}
        >
          Optionen
        </button>
      </div>
      <div className="flex flex-col">
        {buttonMode === "mesa" && (
          <>
            <div>
              <h1 className="text-8xl font-bold my-8 text-center">Mesa</h1>
              <div className="flex flex-row gap-4 my-6">
                <label
                  className={`cursor-pointer text-lg px-6 py-3 border-2 rounded-lg ${
                    selectedMesa === "eightMesa"
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300"
                  } transition duration-200`}
                  onClick={() => handleMesaSelect("eightMesa")}
                >
                  8 Vorspeisen
                </label>
                <label
                  className={`cursor-pointer text-lg px-6 py-3 border-2 rounded-lg ${
                    selectedMesa === "tenMesa"
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300"
                  } transition duration-200`}
                  onClick={() => handleMesaSelect("tenMesa")}
                >
                  10 Vorspeisen
                </label>
              </div>
              <p className="text-lg mt-6">
                {selectedDishes.length} von{" "}
                {selectedMesa === "eightMesa" ? 8 : 10} Vorspeisen ausgewählt
              </p>
              <div className="flex flex-col gap-4 pt-5">
                {dishes.map((dish) => {
                  const isSelected = selectedDishes.includes(dish);
                  const isDisabled =
                    selectedDishes.length >=
                      (selectedMesa === "eightMesa" ? 8 : 10) && !isSelected;

                  return (
                    <label
                      key={dish}
                      className={`cursor-pointer text-lg px-4 py-2 border-2 rounded-lg transition duration-200
          ${isSelected ? "border-violet-500 " : "border-gray-300"}
          ${isDisabled ? "opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        value={dish}
                        checked={isSelected}
                        onChange={() => handleDishSelect(dish)}
                        className="hidden"
                        disabled={isDisabled}
                      />
                      {dish}
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}
        {buttonMode === "menü" && (
          <>
            <h1 className="text-8xl font-bold my-8 text-center">Mesa</h1>
            <div className="flex flex-col gap-4 my-6">
              <div>
                <h2 className="text-5xl font-bold m-3 text-center">
                  Vegetarisches Menü
                </h2>
                <div className="">
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => sub("vegetarisch")}
                  >
                    -
                  </button>
                  <span className="text-lg">{counts.vegetarisch}</span>
                  <button
                    className="p-2 bg-green-500 text-white rounded"
                    onClick={() => add("vegetarisch")}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-bold m-3 text-center">
                  Beiti Menü
                </h2>
                <button
                  className="p-2 bg-red-500 text-white rounded"
                  onClick={() => sub("beiti")}
                >
                  -
                </button>
                <span className="text-lg">{counts.beiti}</span>
                <button
                  className="p-2 bg-green-500 text-white rounded"
                  onClick={() => add("beiti")}
                >
                  +
                </button>
              </div>
            </div>
          </>
        )}
        {buttonMode === "fingerfood" && <></>}
        {buttonMode === "optionen" && <></>}
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
