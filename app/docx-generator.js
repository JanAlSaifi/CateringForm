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
  BorderStyle,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

export async function generateDocx(order, prices, total) {
  let logoBuffer;
  try {
    const response = await fetch("/logo.png");
    logoBuffer = await response.arrayBuffer();
  } catch (error) {
    console.error(
      "Logo konnte nicht geladen werden. Stelle sicher, dass 'logo.png' im 'public' Ordner liegt.",
      error
    );
  }

  // 2. Dokument-Struktur aufbauen
  const doc = new Document({
    sections: [
      {
        children: [
          createHeaderTable(order.deliveryDetails, logoBuffer), // Kopfzeile mit Adressen und Logo
          new Paragraph({ text: " ", spacing: { after: 200 } }),
          createMetaInfoTable(), // Tabelle für Rechnungsnummer und Datum
          new Paragraph({
            text: "Sehr geehrte Damen und Herren,",
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "wir bedanken uns für den Auftrag und stellen Ihnen wie vereinbart folgende Leistung in Rechnung.",
          }),
          createItemsTable(order, prices), // Haupttabelle mit allen bestellten Artikeln
          createTotalsTable(total), // Tabelle für Netto, MwSt. und Brutto
          createFooter(), // Fußzeile mit Bankdaten etc.
        ],
      },
    ],
  });

  // 3. Dokument packen und Download auslösen
  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      `Rechnung-${order.deliveryDetails.contactPerson || "Catering"}.docx`
    );
  });
}

// --- HELPER-FUNKTIONEN ZUM ERSTELLEN DER DOKUMENT-TEILE ---

// Erstellt die Kopfzeile (2-spaltig, unsichtbar)
function createHeaderTable(details, logoBuffer) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Linke Spalte: Adressen
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Restaurant Beiti", bold: true }),
                ],
              }),
              new Paragraph("Alsterdorfer Str. 76"),
              new Paragraph("22299 Hamburg"),
              new Paragraph({ text: " ", spacing: { after: 300 } }), // Abstand
              new Paragraph(details.contactPerson),
              new Paragraph(details.street),
              new Paragraph(`${details.zipCode} ${details.city}`),
            ],
          }),
          // Rechte Spalte: Logo und Kontaktdaten
          new TableCell({
            children: [
              // Logo, falls es geladen wurde
              ...(logoBuffer
                ? [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: logoBuffer,
                          transformation: { width: 150, height: 100 },
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ]
                : []),
              new Paragraph({ text: " ", spacing: { after: 100 } }),
              new Paragraph({
                text: "Telefon: +49 40 694 59 970",
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: "Mobil: +49 176 63881 118",
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: "info@beiti-hamburg.de",
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: "www.beiti-hamburg.de",
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: "Steuer-Nr: 49/206/01443",
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Erstellt die Tabelle für Rechnungs-Nr und Datum
function createMetaInfoTable() {
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}.${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${today.getFullYear()}`;
  // Erzeugt eine simple, einzigartige Nummer basierend auf der Zeit
  const invoiceNumber = `RE-${today.getFullYear()}${
    today.getMonth() + 1
  }${today.getDate()}-${Date.now().toString().slice(-5)}`;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [] }), // Leere Zelle links
          new TableCell({
            children: [
              new Paragraph({
                text: `Rechnung-Nr: ${invoiceNumber}`,
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: `Datum: ${formattedDate}`,
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Erstellt die Haupt-Tabelle mit den bestellten Artikeln
function createItemsTable(order, prices) {
  const { mesa, menus, fingerfood, mainCourses, options } = order;
  const tableHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        children: [new Paragraph({ text: "Menge", bold: true })],
      }),
      new TableCell({
        children: [new Paragraph({ text: "Bezeichnung", bold: true })],
      }),
      new TableCell({
        children: [new Paragraph({ text: "Einzelpreis", bold: true })],
      }),
      new TableCell({
        children: [new Paragraph({ text: "Preis/Brutto", bold: true })],
      }),
    ],
  });

  const tableRows = [];

  // Logik für Mesa
  if (mesa.active) {
    const price = mesa.type === "8" ? prices.mesa8 : prices.mesa10;
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(`${mesa.people}`)] }),
          new TableCell({
            children: [new Paragraph(`Mesa (${mesa.type} Vorspeisen)`)],
          }),
          new TableCell({ children: [new Paragraph(`${price.toFixed(2)} €`)] }),
          new TableCell({
            children: [new Paragraph(`${(price * mesa.people).toFixed(2)} €`)],
          }),
        ],
      })
    );
  }

  // Logik für Menüs
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
  menuItems.forEach((item) => {
    if (menus[item.key] > 0) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(`${menus[item.key]}`)] }),
            new TableCell({ children: [new Paragraph(item.name)] }),
            new TableCell({
              children: [new Paragraph(`${item.price.toFixed(2)} €`)],
            }),
            new TableCell({
              children: [
                new Paragraph(`${(item.price * menus[item.key]).toFixed(2)} €`),
              ],
            }),
          ],
        })
      );
    }
  });

  // Logik für andere Posten (Fingerfood, Hauptgerichte, etc.)
  const otherItems = [
    ...Object.entries(fingerfood),
    ...Object.entries(mainCourses),
  ];
  const otherPrices = { ...prices.fingerfood, ...prices.mainCourses };
  const formatName = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace("Kaese", "Käse")
      .trim();

  otherItems.forEach(([key, count]) => {
    if (count > 0) {
      tableRows.push(
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
              children: [new Paragraph(`${otherPrices[key].toFixed(2)} €`)],
            }),
            new TableCell({
              children: [
                new Paragraph(`${(otherPrices[key] * count).toFixed(2)} €`),
              ],
            }),
          ],
        })
      );
    }
  });

  // Transportkosten
  if (options.transport) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("1")] }),
          new TableCell({ children: [new Paragraph("Lieferkosten")] }),
          new TableCell({ children: [new Paragraph("")] }), // Kein Einzelpreis
          new TableCell({
            children: [
              new Paragraph(`${prices.options.transport.toFixed(2)} €`),
            ],
          }),
        ],
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableHeader, ...tableRows],
    spacing: { before: 400, after: 400 },
  });
}

// Erstellt die untere Tabelle für die Summen
function createTotalsTable(totalBrutto) {
  // Annahme: 7% MwSt. wie in der PDF-Rechnung
  const totalNetto = (parseFloat(totalBrutto) / 1.07).toFixed(2);
  const mwstAmount = (parseFloat(totalBrutto) - parseFloat(totalNetto)).toFixed(
    2
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [] }), // Leere Zelle
          new TableCell({
            children: [
              new Paragraph({
                text: `Netto: ${totalNetto} €`,
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                text: `MwSt. 7%: ${mwstAmount} €`,
                alignment: AlignmentType.RIGHT,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Gesamtbetrag Brutto: ${totalBrutto} €`,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Erstellt die Fußzeile mit den Bankdaten
function createFooter() {
  const today = new Date();
  // Lieferdatum kann aus der App kommen, hier als Beispiel das heutige Datum
  const lieferDatum = `${today.getDate().toString().padStart(2, "0")}.${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${today.getFullYear()}`;

  return new Paragraph({
    children: [
      new TextRun({ text: `Lieferdatum: ${lieferDatum}`, break: 2 }),
      new TextRun({
        text: "Der Betrag ist innerhalb der nächsten sieben Tage auf das unten genannte Konto zu überweisen.",
        break: 2,
      }),
      new TextRun({
        text: "Restaurant Beiti Inh. Fadi Al Saifi",
        bold: true,
        break: 2,
      }),
      new TextRun({
        text: "Commerzbank AG - IBAN: DE42200400000624647400 - BIC: COBADFFXXX",
        break: 1,
      }),
    ],
    spacing: { before: 300 },
  });
}
