"use client";
import { useState } from "react";
import { Button } from "react";

export default function Home() {
  const [buttonMode, setButtonMode] = useState("mesa");

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
        {buttonMode === "mesa" && <></>}
        {buttonMode === "menü" && <></>}
        {buttonMode === "fingerfood" && <></>}
        {buttonMode === "optionen" && <></>}
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
