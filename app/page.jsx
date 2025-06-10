"use client";
import { useState } from "react";
import { generateDocx } from "./docx-generator.js";

// Helper Component for a modern Toggle Switch (Dark Theme)
const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer p-3 border border-gray-700 rounded-lg">
      <span className="text-lg font-semibold text-gray-200">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-14 h-8 bg-gray-600 rounded-full peer-checked:bg-red-800 transition-colors"></div>
        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
      </div>
    </label>
  );
};

// Helper component for quantity controls (Dark Theme)
const QuantityControl = ({ name, value, onUpdate }) => (
  <div className="flex justify-between items-center p-2 border border-gray-700 rounded-lg">
    <span className="text-lg text-gray-200">{name}</span>
    <div className="flex items-center gap-3">
      <button
        className="p-2 w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-2xl transition-colors"
        onClick={() => onUpdate(value - 1)}
      >
        -
      </button>
      <span className="text-lg w-8 text-center font-bold text-white">
        {value}
      </span>
      <button
        className="p-2 w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-2xl transition-colors"
        onClick={() => onUpdate(value + 1)}
      >
        +
      </button>
    </div>
  </div>
);

export default function Home() {
  const [buttonMode, setButtonMode] = useState("mesa");

  const [order, setOrder] = useState({
    // HIER WURDEN DIE LIEFERDETAILS HINZUGEFÜGT
    deliveryDetails: {
      contactPerson: "",
      street: "",
      zipCode: "",
      city: "",
    },
    mesa: {
      active: false,
      type: "10", // '8' or '10'
      people: 1,
      dishes: [],
    },
    menus: {
      vegetarisch: 0,
      beiti1oder2: 0,
      beiti3: 0,
    },
    fingerfood: {
      falafel: 0,
      teigtaschenSpinat: 0,
      teigtaschenKaese: 0,
      kibbeh: 0,
      kabab: 0,
      haehnchenspiess: 0,
      makanek: 0,
      lammfiletSpiess: 0,
      scampiSpiess: 0,
    },
    mainCourses: {
      maklube: 0,
      dajajBelTamer: 0,
      lammfilet: 0,
      grillplatte: 0,
      lachs: 0,
    },
    options: {
      dessertPeople: 0,
      weinFlaschen: 0,
      transport: false,
    },
  });

  const mesaDishes = [
    "Hummus",
    "Tabouleh",
    "Labneh",
    "Walnuss-Paprika-Paste",
    "Kartoffeln in Zitrone",
    "Gebratene Auberginen",
    "Gebratener Blumenkohl",
    "Schneidebohnen",
    "Rote-Beete-Salat",
    "Orientalischer Olivensalat",
    "Weiße Bohnen mit Curry",
    "Karotten eingelegt",
    "Kichererbsen-Salat",
    "Saubohnen",
    "Eingelegter Spinat",
    "Okraschoten",
    "Kohlrabi mit Knoblauch",
    "Artischockensalat",
    "Moussaka",
    "Kartoffeln frittiert",
    "Geräuchertes Auberginenmus",
    "Orientalischer Linsensalat",
    "Bulgur in Tomaten-Paprika Paste",
  ];

  const prices = {
    mesa8: 17.0,
    mesa10: 19.5,
    menuVegetarisch: 27.5,
    menuBeiti1oder2: 28.5,
    menuBeiti3: 32.5,
    fingerfood: {
      falafel: 1.0,
      teigtaschenSpinat: 2.2,
      teigtaschenKaese: 2.2,
      kibbeh: 3.5,
      kabab: 4.0,
      haehnchenspiess: 4.0,
      makanek: 4.0,
      lammfiletSpiess: 6.5,
      scampiSpiess: 4.5,
    },
    mainCourses: {
      maklube: 16.0,
      dajajBelTamer: 17.5,
      lammfilet: 23.5,
      grillplatte: 21.5,
      lachs: 18.5,
    },
    options: {
      dessert: 7.5,
      wein: 20.0,
      transport: 35.0,
    },
  };

  // HIER WURDE DER HANDLER FÜR DIE ADRESSFELDER HINZUGEFÜGT
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      deliveryDetails: {
        ...prev.deliveryDetails,
        [name]: value,
      },
    }));
  };

  const handleMesaDishSelect = (dish) => {
    const isSelected = order.mesa.dishes.includes(dish);
    const maxDishes = order.mesa.type === "8" ? 8 : 10;
    if (isSelected) {
      setOrder((prev) => ({
        ...prev,
        mesa: {
          ...prev.mesa,
          dishes: prev.mesa.dishes.filter((d) => d !== dish),
        },
      }));
    } else if (order.mesa.dishes.length < maxDishes) {
      setOrder((prev) => ({
        ...prev,
        mesa: { ...prev.mesa, dishes: [...prev.mesa.dishes, dish] },
      }));
    }
  };

  const updateQuantity = (category, item, amount) => {
    setOrder((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: Math.max(0, prev[category][item] + amount),
      },
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    if (order.mesa.active) {
      const mesaPrice = order.mesa.type === "8" ? prices.mesa8 : prices.mesa10;
      total += mesaPrice * order.mesa.people;
    }
    total += order.menus.vegetarisch * prices.menuVegetarisch;
    total += order.menus.beiti1oder2 * prices.menuBeiti1oder2;
    total += order.menus.beiti3 * prices.menuBeiti3;
    for (const [item, count] of Object.entries(order.fingerfood)) {
      total += count * prices.fingerfood[item];
    }
    for (const [item, count] of Object.entries(order.mainCourses)) {
      total += count * prices.mainCourses[item];
    }
    if (order.options.dessertPeople >= 5) {
      total += order.options.dessertPeople * prices.options.dessert;
    }
    total += order.options.weinFlaschen * prices.options.wein;
    if (order.options.transport) {
      total += prices.options.transport;
    }
    return total.toFixed(2);
  };

  const handleExport = () => {
    const total = calculateTotal();
    generateDocx(order, prices, total);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 grid items-start justify-items-center p-4 sm:p-12 gap-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {/* HIER WURDE DER NEUE BUTTON FÜR DIE LIEFERDETAILS HINZUGEFÜGT */}
        <button
          className={`p-4 rounded-lg text-white text-xl font-semibold transition-colors ${
            buttonMode === "details"
              ? "bg-red-900"
              : "bg-red-800 hover:bg-red-700"
          }`}
          onClick={() => setButtonMode("details")}
        >
          Lieferdetails
        </button>
        <button
          className={`p-4 rounded-lg text-white text-xl font-semibold transition-colors ${
            buttonMode === "mesa" ? "bg-red-900" : "bg-red-800 hover:bg-red-700"
          }`}
          onClick={() => setButtonMode("mesa")}
        >
          Mesa
        </button>
        <button
          className={`p-4 rounded-lg text-white text-xl font-semibold transition-colors ${
            buttonMode === "menü" ? "bg-red-900" : "bg-red-800 hover:bg-red-700"
          }`}
          onClick={() => setButtonMode("menü")}
        >
          Menüs
        </button>
        <button
          className={`p-4 rounded-lg text-white text-xl font-semibold transition-colors ${
            buttonMode === "fingerfood"
              ? "bg-red-900"
              : "bg-red-800 hover:bg-red-700"
          }`}
          onClick={() => setButtonMode("fingerfood")}
        >
          Fingerfood
        </button>
        <button
          className={`p-4 rounded-lg text-white text-xl font-semibold transition-colors ${
            buttonMode === "optionen"
              ? "bg-red-900"
              : "bg-red-800 hover:bg-red-700"
          }`}
          onClick={() => setButtonMode("optionen")}
        >
          Optionen
        </button>
      </div>

      <div className="flex flex-col w-full max-w-2xl mb-24">
        {/* HIER WURDE DIE NEUE SEKTION FÜR DIE LIEFERDETAILS HINZUGEFÜGT */}
        {buttonMode === "details" && (
          <div className="w-full">
            <h1 className="text-5xl font-bold my-6 text-center text-red-400">
              Lieferdetails
            </h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4">
              <h2 className="text-2xl font-bold mb-2 text-red-400/80">
                Anschrift & Kontakt
              </h2>
              <div>
                <label
                  htmlFor="contactPerson"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Ansprechperson
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  id="contactPerson"
                  value={order.deliveryDetails.contactPerson}
                  onChange={handleDetailsChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Straße & Hausnummer
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={order.deliveryDetails.street}
                  onChange={handleDetailsChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    PLZ
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={order.deliveryDetails.zipCode}
                    onChange={handleDetailsChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div className="flex-[2]">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Stadt
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={order.deliveryDetails.city}
                    onChange={handleDetailsChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {buttonMode === "mesa" && (
          <div className="w-full">
            <h1 className="text-5xl font-bold my-6 text-center text-red-400">
              Mesa
            </h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4">
              <ToggleSwitch
                label="Mesa bestellen"
                checked={order.mesa.active}
                onChange={(e) =>
                  setOrder((p) => ({
                    ...p,
                    mesa: { ...p.mesa, active: e.target.checked },
                  }))
                }
              />
              {order.mesa.active && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4 my-2">
                    <label
                      className={`cursor-pointer flex-1 text-center text-lg px-6 py-3 border-2 rounded-lg transition-colors ${
                        order.mesa.type === "8"
                          ? "border-red-700 bg-red-800 text-white"
                          : "border-gray-600 text-gray-200"
                      }`}
                      onClick={() =>
                        setOrder((p) => ({
                          ...p,
                          mesa: { ...p.mesa, type: "8", dishes: [] },
                        }))
                      }
                    >
                      8 Vorspeisen
                    </label>
                    <label
                      className={`cursor-pointer flex-1 text-center text-lg px-6 py-3 border-2 rounded-lg transition-colors ${
                        order.mesa.type === "10"
                          ? "border-red-700 bg-red-800 text-white"
                          : "border-gray-600 text-gray-200"
                      }`}
                      onClick={() =>
                        setOrder((p) => ({
                          ...p,
                          mesa: { ...p.mesa, type: "10", dishes: [] },
                        }))
                      }
                    >
                      10 Vorspeisen
                    </label>
                  </div>
                  <QuantityControl
                    name="Anzahl Personen"
                    value={order.mesa.people}
                    onUpdate={(newValue) =>
                      setOrder((p) => ({
                        ...p,
                        mesa: { ...p.mesa, people: Math.max(1, newValue) },
                      }))
                    }
                  />
                  <p className="text-lg mt-2 font-semibold text-gray-300">
                    {" "}
                    {order.mesa.dishes.length} von {order.mesa.type} Vorspeisen
                    ausgewählt{" "}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {mesaDishes.map((dish) => {
                      const isSelected = order.mesa.dishes.includes(dish);
                      const isDisabled =
                        order.mesa.dishes.length >=
                          (order.mesa.type === "8" ? 8 : 10) && !isSelected;
                      return (
                        <label
                          key={dish}
                          className={`cursor-pointer text-base px-4 py-3 border-2 rounded-lg transition-colors ${
                            isSelected
                              ? "border-red-700 bg-gray-700"
                              : "border-gray-700"
                          } ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-red-600 hover:bg-gray-700/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={dish}
                            checked={isSelected}
                            onChange={() => handleMesaDishSelect(dish)}
                            className="hidden"
                            disabled={isDisabled}
                          />
                          {dish}
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {buttonMode === "menü" && (
          <div className="w-full">
            <h1 className="text-5xl font-bold my-6 text-center text-red-400">
              Menüs
            </h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4">
              <QuantityControl
                name="Vegetarisches Menü"
                value={order.menus.vegetarisch}
                onUpdate={(val) =>
                  updateQuantity(
                    "menus",
                    "vegetarisch",
                    val - order.menus.vegetarisch
                  )
                }
              />
              <QuantityControl
                name="Beiti Menü (1 oder 2)"
                value={order.menus.beiti1oder2}
                onUpdate={(val) =>
                  updateQuantity(
                    "menus",
                    "beiti1oder2",
                    val - order.menus.beiti1oder2
                  )
                }
              />
              <QuantityControl
                name="Beiti Menü (3 - Lammfilet)"
                value={order.menus.beiti3}
                onUpdate={(val) =>
                  updateQuantity("menus", "beiti3", val - order.menus.beiti3)
                }
              />
            </div>
          </div>
        )}

        {buttonMode === "fingerfood" && (
          <div className="w-full">
            <h1 className="text-5xl font-bold my-6 text-center text-red-400">
              Fingerfood & Grill
            </h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4">
              <QuantityControl
                name="Falafel"
                value={order.fingerfood.falafel}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "falafel",
                    val - order.fingerfood.falafel
                  )
                }
              />
              <QuantityControl
                name="Gef. Blätterteigt. (Spinat)"
                value={order.fingerfood.teigtaschenSpinat}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "teigtaschenSpinat",
                    val - order.fingerfood.teigtaschenSpinat
                  )
                }
              />
              <QuantityControl
                name="Gef. Blätterteigt. (Käse)"
                value={order.fingerfood.teigtaschenKaese}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "teigtaschenKaese",
                    val - order.fingerfood.teigtaschenKaese
                  )
                }
              />
              <QuantityControl
                name="Kibbeh"
                value={order.fingerfood.kibbeh}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "kibbeh",
                    val - order.fingerfood.kibbeh
                  )
                }
              />
              <QuantityControl
                name="Kabab Spieß"
                value={order.fingerfood.kabab}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "kabab",
                    val - order.fingerfood.kabab
                  )
                }
              />
              <QuantityControl
                name="Hähnchenbrustspieß"
                value={order.fingerfood.haehnchenspiess}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "haehnchenspiess",
                    val - order.fingerfood.haehnchenspiess
                  )
                }
              />
              <QuantityControl
                name="Makanek"
                value={order.fingerfood.makanek}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "makanek",
                    val - order.fingerfood.makanek
                  )
                }
              />
              <QuantityControl
                name="Lammfilet-Spieß"
                value={order.fingerfood.lammfiletSpiess}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "lammfiletSpiess",
                    val - order.fingerfood.lammfiletSpiess
                  )
                }
              />
              <QuantityControl
                name="Scampi-Spieß"
                value={order.fingerfood.scampiSpiess}
                onUpdate={(val) =>
                  updateQuantity(
                    "fingerfood",
                    "scampiSpiess",
                    val - order.fingerfood.scampiSpiess
                  )
                }
              />
            </div>
          </div>
        )}

        {buttonMode === "optionen" && (
          <div className="w-full">
            <h1 className="text-5xl font-bold my-6 text-center text-red-400">
              Hauptgerichte & Optionen
            </h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-red-400/80">
                  Hauptgerichte (einzeln)
                </h2>
                <div className="flex flex-col gap-4">
                  <QuantityControl
                    name="Maklube"
                    value={order.mainCourses.maklube}
                    onUpdate={(val) =>
                      updateQuantity(
                        "mainCourses",
                        "maklube",
                        val - order.mainCourses.maklube
                      )
                    }
                  />
                  <QuantityControl
                    name="Dajaj bel Tamer"
                    value={order.mainCourses.dajajBelTamer}
                    onUpdate={(val) =>
                      updateQuantity(
                        "mainCourses",
                        "dajajBelTamer",
                        val - order.mainCourses.dajajBelTamer
                      )
                    }
                  />
                  <QuantityControl
                    name="Lammfilet"
                    value={order.mainCourses.lammfilet}
                    onUpdate={(val) =>
                      updateQuantity(
                        "mainCourses",
                        "lammfilet",
                        val - order.mainCourses.lammfilet
                      )
                    }
                  />
                  <QuantityControl
                    name="Grillplatte"
                    value={order.mainCourses.grillplatte}
                    onUpdate={(val) =>
                      updateQuantity(
                        "mainCourses",
                        "grillplatte",
                        val - order.mainCourses.grillplatte
                      )
                    }
                  />
                  <QuantityControl
                    name="Lachs"
                    value={order.mainCourses.lachs}
                    onUpdate={(val) =>
                      updateQuantity(
                        "mainCourses",
                        "lachs",
                        val - order.mainCourses.lachs
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-red-400/80">
                  Weitere Optionen
                </h2>
                <div className="flex flex-col gap-4">
                  <QuantityControl
                    name="Dessert (ab 5 Pers.)"
                    value={order.options.dessertPeople}
                    onUpdate={(val) =>
                      updateQuantity(
                        "options",
                        "dessertPeople",
                        val - order.options.dessertPeople
                      )
                    }
                  />
                  <QuantityControl
                    name="Wein aus dem Libanon (Flasche)"
                    value={order.options.weinFlaschen}
                    onUpdate={(val) =>
                      updateQuantity(
                        "options",
                        "weinFlaschen",
                        val - order.options.weinFlaschen
                      )
                    }
                  />
                  <ToggleSwitch
                    label="Transport (Hamburg)"
                    checked={order.options.transport}
                    onChange={(e) =>
                      setOrder((p) => ({
                        ...p,
                        options: { ...p.options, transport: e.target.checked },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full max-w-2xl fixed bottom-0 z-10">
        <div className="bg-gray-950/80 backdrop-blur-sm text-white p-4 rounded-t-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Gesamt: {calculateTotal()} €
          </h2>
          <button
            onClick={handleExport}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl w-full sm:w-auto transition-colors"
          >
            Als Word-DOCX speichern
          </button>
        </div>
      </footer>
    </div>
  );
}
