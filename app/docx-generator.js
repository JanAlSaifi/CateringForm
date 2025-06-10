// docx-generator.js

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

// file-saver wird benötigt, um den Download im Browser auszulösen
import { saveAs } from "file-saver";

// Diese Funktion wird alle Bestelldaten erhalten und das Dokument erstellen
export function generateDocx(order, prices, total) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Kostenvoranschlag Catering",
                bold: true,
                size: 32,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Dynamische Sektionen hier einfügen
          ...createMesaSection(order.mesa, prices),
          ...createMenuSection(order.menus, prices),
          ...createItemsTable(
            "Fingerfood & Grillspezialitäten",
            order.fingerfood,
            prices.fingerfood
          ),
          ...createItemsTable(
            "Hauptgerichte",
            order.mainCourses,
            prices.mainCourses
          ),
          ...createOptionsSection(order.options, prices.options),

          // Gesamtpreis
          new Paragraph({
            children: [
              new TextRun({
                text: `Gesamtpreis (inkl. MwSt.): ${total} €`,
                bold: true,
                size: 28,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  // Das Dokument packen und den Download starten
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Kostenvoranschlag-Catering.docx");
    console.log("Dokument erfolgreich erstellt.");
  });
}

// Helper-Funktionen, um die Sektionen zu erstellen

function createMesaSection(mesa, prices) {
  if (!mesa.active) return [];
  const pricePerPerson =
    mesa.type === "8" ? prices.mesa8.toFixed(2) : prices.mesa10.toFixed(2);
  return [
    new Paragraph({
      text: `Mesa für ${mesa.people} Personen (${mesa.type} Vorspeisen)`,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),
    new Paragraph({ text: `Preis pro Person: ${pricePerPerson}€` }),
    new Paragraph({
      text: "Ausgewählte Vorspeisen:",
      bold: true,
      spacing: { before: 100 },
    }),
    ...mesa.dishes.map(
      (dish) => new Paragraph({ text: `- ${dish}`, bullet: { level: 0 } })
    ),
  ];
}

function createMenuSection(menus, prices) {
  const menuItems = [
    {
      key: "vegetarisch",
      name: "Vegetarisches Menü",
      price: prices.menuVegetarisch,
    },
    {
      key: "beiti1oder2",
      name: "Beiti Menü 1 oder 2",
      price: prices.menuBeiti1oder2,
    },
    { key: "beiti3", name: "Beiti Menü 3", price: prices.menuBeiti3 },
  ];
  const createdMenus = menuItems.filter((item) => menus[item.key] > 0);
  if (createdMenus.length === 0) return [];

  return [
    new Paragraph({
      text: "Menüs",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),
    ...createdMenus.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun(`${menus[item.key]}x `),
            new TextRun({ text: item.name, bold: true }),
            new TextRun(` à ${item.price.toFixed(2)}€`),
          ],
        })
    ),
  ];
}

function createItemsTable(title, items, itemPrices) {
  const filteredItems = Object.entries(items).filter(([, count]) => count > 0);
  if (filteredItems.length === 0) return [];

  const formatName = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace("Kaese", "Käse")
      .trim();

  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Tabellenüberschrift
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "Anzahl", bold: true })],
            }),
            new TableCell({
              children: [new Paragraph({ text: "Artikel", bold: true })],
            }),
            new TableCell({
              children: [new Paragraph({ text: "Preis/Stück", bold: true })],
            }),
          ],
        }),
        // Tabellenzeilen
        ...filteredItems.map(
          ([key, count]) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(`${count}`)] }),
                new TableCell({
                  children: [
                    new Paragraph(
                      formatName(key).charAt(0).toUpperCase() +
                        formatName(key).slice(1)
                    ),
                  ],
                }),
                new TableCell({
                  children: [new Paragraph(`${itemPrices[key].toFixed(2)}€`)],
                }),
              ],
            })
        ),
      ],
    }),
  ];
}

function createOptionsSection(options, optionPrices) {
  const items = [];
  if (options.dessertPeople > 0) {
    const note = options.dessertPeople < 5 ? " (ab 5 Pers.)" : "";
    items.push(
      new Paragraph({
        text: `${
          options.dessertPeople
        }x Dessert${note} à ${optionPrices.dessert.toFixed(2)}€`,
      })
    );
  }
  if (options.weinFlaschen > 0) {
    items.push(
      new Paragraph({
        text: `${
          options.weinFlaschen
        }x Flasche Wein à ${optionPrices.wein.toFixed(2)}€`,
      })
    );
  }
  if (options.transport) {
    items.push(
      new Paragraph({
        text: `1x Transport (Hamburg) à ${optionPrices.transport.toFixed(2)}€`,
      })
    );
  }
  if (items.length === 0) return [];

  return [
    new Paragraph({
      text: "Weitere Optionen",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),
    ...items,
  ];
}
