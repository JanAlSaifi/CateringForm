"use client";
import { useState } from "react";

export default function Home() {
  const [buttonMode, setButtonMode] = useState("mesa");
  const [countMesa, setCountMesa] = useState({
    Hummus: 0,
    Tabouleh: 0,
    Labneh: 0,
    WalnussPaprikaPaste: 0,
    Kartoffeln: 0,
    Auberginen: 0,
    Blumenkohl: 0,
    Schneidebohnen: 0,
    RoteBeeteSalat: 0,
    Olivensalat: 0,
    Bohnen: 0,
    Karotten: 0,
    KichererbsenSalat: 0,
    Saubohnen: 0,
    Spinat: 0,
    Okraschoten: 0,
    Kohlrabi: 0,
    Artischockensalat: 0,
    Moussaka: 0,
    "Kartoffeln frittiert": 0,
    Auberginenmus: 0,
    Linsensalat: 0,
    Bulgur: 0,
  });

  const [selected, setSelected] = useState(null);

  const AddMesa = (item) => {
    setCountMesa((prevCounts) => ({
      ...prevCounts,
      [item]: prevCounts[item] + 1,
    }));
  };
  const SubMesa = (item) => {
    setCountMesa((prevCounts) => ({
      ...prevCounts,
      [item]: prevCounts[item] - 1,
    }));
  };

  const handleSelect = (value) => {
    setSelected(selected === value ? null : value);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <div className="flex gap-6 items-center sm:items-start text-5xl ">
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-2 rounded-lg"
          onClick={() => setButtonMode("mesa")}
        >
          Mesa
        </button>
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-2 rounded-lg"
          onClick={() => setButtonMode("menü")}
        >
          Menü
        </button>
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-2 rounded-lg"
          onClick={() => setButtonMode("fingerfood")}
        >
          FingerFood
        </button>
        <button
          className=" bg-violet-500 hover:bg-violet-600 p-2 rounded-lg"
          onClick={() => setButtonMode("optionen")}
        >
          Optionen
        </button>
      </div>
      <div className="flex flex-col">
        {buttonMode === "mesa" && (
          <>
            <div>
              <h1 className="text-6xl m-3 text-center">Mesa</h1>
              <div className="flex flex-row gap-4 my-6">
                <input
                  type="checkbox"
                  id="eightMesa"
                  name="eightMesa"
                  value="eightMesa"
                  className="hidden"
                />
                <label
                  htmlFor="eightMesa"
                  className={`cursor-pointer text-lg px-6 py-3 border-2 rounded-lg ${
                    selected === "eightMesa"
                      ? "border-violet-500 bg-violet-500"
                      : ""
                  } transition duration-200`}
                  onClick={() => handleSelect("eightMesa")}
                >
                  8 Vorspeisen
                </label>
                <input
                  type="checkbox"
                  id="tenMesa"
                  name="tenMesa"
                  value="tenMesa"
                  className="hidden"
                />
                <label
                  htmlFor="tenMesa"
                  className={`cursor-pointer text-lg px-6 py-3 border-2 rounded-lg ${
                    selected === "tenMesa"
                      ? "border-violet-500 bg-violet-500"
                      : ""
                  } transition duration-200`}
                  onClick={() => handleSelect("tenMesa")}
                >
                  10 Vorspeisen
                </label>
              </div>
              {Object.keys(countMesa).map((item) => (
                <div key={item} className="mb-4 text-xl">
                  <button onClick={() => AddMesa(item)}>{item}:</button>

                  <span className="pl-7">{countMesa[item]}</span>
                  <button onClick={() => SubMesa(item)}>-</button>
                </div>
              ))}
            </div>
          </>
        )}
        {buttonMode === "menü" && <></>}
        {buttonMode === "fingerfood" && <></>}
        {buttonMode === "optionen" && <></>}
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
