setupNavigation();
// ==============================
// PRONALAŽENJE AUTOMOBILA
// ==============================

// Čitamo ID automobila iz URL-a
const parametri = new URLSearchParams(window.location.search);

const idParametra = parametri.get("id");

const idAutomobila = idParametra === null ? NaN : Number(idParametra);

// Pronalazimo automobil u nizu
const automobil = cars.find(car => carId(car) === idParametra) || (idParametra !== null && /^\d+$/.test(idParametra) ? cars[idAutomobila] : undefined);

// Provjeravamo postoji li automobil
if (!automobil) {
  document.querySelector(".detalji-main").innerHTML =
    '<h1>Automobil nije pronađen.</h1><p>Vozilo možda više nije u ponudi.</p><a href="./index.html#vozila">Pogledajte sva vozila →</a>';
} else {
  // ==============================
  // SEO ZA POJEDINAČNI AUTOMOBIL
  // ==============================

  document.title = `${automobil.name} | LUXCAR Gradiška`;

  let metaOpis = document.querySelector('meta[name="description"]');

  if (!metaOpis) {
    metaOpis = document.createElement("meta");
    metaOpis.name = "description";
    document.head.appendChild(metaOpis);
  }

  const kilometraza = automobil.mileage != null ? automobil.mileage.toLocaleString("de-DE") + " km" : "Kilometraža nije navedena";
  metaOpis.content = `LUXCAR Gradiška – ${automobil.name}, godište ${automobil.year || "nije navedeno"}, ${automobil.fuel || "gorivo nije navedeno"}, ${kilometraza}. Cijena: ${formatPrice(automobil.price)}. Kontaktirajte nas za više informacija.`;

  // ==============================
  // OPEN GRAPH ZA DIJELJENJE LINKA
  // ==============================

  function postaviMetaTag(property, content) {
    let metaTag = document.querySelector(`meta[property="${property}"]`);

    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("property", property);
      document.head.appendChild(metaTag);
    }

    metaTag.content = content;
  }

  postaviMetaTag("og:type", "product");
  postaviMetaTag("og:title", document.title);
  postaviMetaTag("og:description", metaOpis.content);
  postaviMetaTag(
    "og:image",
    new URL(carImages(automobil)[0] || placeholderImage, window.location.href).href,
  );
  postaviMetaTag("og:url", window.location.href);
  // ==============================
  // OSNOVNE INFORMACIJE
  // ==============================

  document.querySelector(".kategorija").textContent = automobil.category || "";

  document.querySelector(".zaglavlje-vozila h1").textContent = automobil.name;
  document.querySelector(".podnaslov-vozila").textContent =
    automobil.subtitle || "";

  document.querySelector(".cijena").textContent =
    formatPrice(automobil.price);

  setResponsiveImage(document.querySelector(".glavna-slika img"), carImages(automobil)[0] || placeholderImage, galleryImageSizes);

  document.querySelector(".glavna-slika img").alt = automobil.name;

  const osnovneSpecifikacije = document.querySelector(".osnovne-specifikacije");

  osnovneSpecifikacije.innerHTML = `
    <div class="specifikacija">
      <span>Godište</span>
      <strong>${automobil.year || "Nije navedeno"}</strong>
    </div>

    <div class="specifikacija">
      <span>Kilometraža</span>
      <strong>${kilometraza}</strong>
    </div>

    <div class="specifikacija">
      <span>Gorivo</span>
      <strong>${automobil.fuel || "Nije navedeno"}</strong>
    </div>

    <div class="specifikacija">
      <span>Mjenjač</span>
      <strong>${automobil.transmission || "Nije navedeno"}</strong>
    </div>

    <div class="specifikacija">
      <span>Snaga</span>
      <strong>${automobil.power || "Nije navedeno"}</strong>
    </div>

    <div class="specifikacija">
      <span>Pogon</span>
      <strong>${automobil.pogon || "Nije navedeno"}</strong>
    </div>
  `;

  // ==============================
  // TEHNIČKI PODACI
  // ==============================

  const podaciGrid = document.querySelector(".podaci-grid");

  const tehnickiPodaci = [
    ["Model", automobil.model],
    ["Tip vozila", automobil.tip],
    ["Broj osovina", automobil.brojOsovina],
    ["Prva registracija", automobil.prvaRegistracija || automobil.godinaPrveRegistracije],
    ["Veličina felgi", automobil.velicinaFelgi],
    ["Broj stepeni prenosa", automobil.brojStepeniPrenosa],
    ["Emisioni standard", automobil.emisioniStandard],
    ["Boja", automobil.boja],
    ["Broj sjedećih mjesta", automobil.sjedecihMjesta],
    ["Pogon", automobil.pogon],
    ["Broj prethodnih vlasnika", automobil.brojPrethodnihVlasnika],
  ];

  tehnickiPodaci.forEach(function (podatak) {
    if (podatak[1] !== undefined && podatak[1] !== null && podatak[1] !== "" && podatak[1] !== "Nije navedeno") {
      podaciGrid.innerHTML += `
        <div class="podatak">
          <span>${podatak[0]}</span>
          <strong>${podatak[1]}</strong>
        </div>
      `;
    }
  });
  document.querySelector('.tehnicki-podaci').hidden = podaciGrid.children.length === 0;

  // ==============================
  // OPREMA I SIGURNOST
  // ==============================

  const opremaGrid = document.querySelector(".oprema-grid");

  const oprema = [
    ["Panoramski krov", automobil.panoramskiKrov],
    ["Vazdušni ovjes", automobil.vazdusniOvjes],
    ["Grijanje volana", automobil.grijanjeVolana],
    ["Električno otvaranje prtljažnika", automobil.elektricniGepek],
    ["Terrain Response", automobil.terrainResponse],
    ["Automatska duga svjetla", automobil.automatskaDugaSvjetla],
    ["Aluminijske felge", automobil.aluFelge],
    ["Daljinsko otključavanje", automobil.daljinskoOtkljucavanje],
    ["Parking kamera", automobil.parkingKamera],
    ["Enterijer", automobil.enterijer],
    ["Muzika", automobil.muzika],
    ["Park Assist", automobil.parkAssist],
    ["Senzor mrtvog ugla", automobil.senzorMrtvogUgla],
    ["Memorija sjedišta", automobil.memorijaSjedista],
    ["Električno pomjeranje sjedišta", automobil.elektricnoPomjeranjeSjedista || automobil.elPomjeranjeSjedista],
    ["ISOFIX", automobil.isofix],
    ["Kuka za vuču", automobil.autoKuka],
    ["Klima uređaj", automobil.klima],
    ["Parking senzori", automobil.senzori || automobil.parkingSenzori],
    ["Svjetla", automobil.svjetla],
    ["Komande na volanu", automobil.komandeNaVolanu],
    ["Touch screen", automobil.touchScreen],
    ["USB port", automobil.usbPort],
    ["Bluetooth", automobil.bluetooth],
    ["Senzor kiše", automobil.senzorKise],
    ["Start/Stop sistem", automobil.startStop],
    ["Masaža sjedišta", automobil.masazaSjedista],
    ["Hlađenje sjedišta", automobil.hladjenjeSjedista],
    ["Naslon za ruku", automobil.naslonZaRuku],
    ["Električni retrovizori", automobil.elektricniRetrovizor || automobil.elektricniRetrovizori],
    ["Digitalna klima", automobil.digitalnaKlima],
    ["Navigacija", automobil.navigacija],
    ["Tempomat", automobil.tempomat],
    ["Limiter brzine", automobil.limiterBrzine],
    ["Board computer", automobil.boardComputer],
    ["Podešavanje sjedišta", automobil.podesavanjeSjedista],
    ["Broj ključeva", automobil.brojKljuceva],
    ["Metalik boja", automobil.metalik],
    ["Ocarinjeno", automobil.ocarinjen],
    ["Apple CarPlay", automobil.carPlay],
    ["Automatska svjetla", automobil.senzorAutoSvjetla],
    ["Head-up display", automobil.headUpDisplay],
    ["Hill Assist", automobil.hillAssist],
    ["Grijanje sjedišta", automobil.grijanjeSjedista],
    ["Električni podizači stakala", automobil.elPodizacStakala],
    ["Maglenke", automobil.maglenke],
    ["ABS", automobil.abs],
    ["ESP", automobil.esp],
    ["Airbag", automobil.airBag],
    ["Alarm", automobil.alarm],
    ["Centralna brava", automobil.centralnaBrava],
    ["Servo volan", automobil.servoVolan],
    ["DPF", automobil.dpf],
    ["Turbo", automobil.turbo],
    ["Servisna knjiga", automobil.servisnaKnjiga],
  ];

  oprema.forEach(function (stavka) {
    if (stavka[1] && stavka[1] !== "Ne" && stavka[1] !== "❌") {
      opremaGrid.innerHTML += `
        <div class="oprema-stavka">
          <span>✓</span>
          ${stavka[0]}${stavka[1] === "✅" || stavka[1] === true ? "" : ": " + stavka[1]}
        </div>
      `;
    }
  });

  // PRIKAZIVANJE I SKRIVANJE OPREME

  const opremaSadrzaj = document.querySelector(".oprema-sadrzaj");
  const prikaziOpremu = document.querySelector("#prikaziOpremu");
  document.querySelector('.oprema').hidden = opremaGrid.children.length === 0;
  function prilagodiOpremu() {
    const kratka = opremaGrid.scrollHeight <= 260;
    opremaSadrzaj.classList.toggle('kratka-lista', kratka);
    prikaziOpremu.hidden = kratka;
  }
  prilagodiOpremu();
  window.addEventListener('resize', prilagodiOpremu);

  prikaziOpremu.addEventListener("click", function () {
    opremaSadrzaj.classList.toggle("prosireno");

    prikaziOpremu.classList.toggle("otvoreno");

    prikaziOpremu.setAttribute(
      "aria-expanded",
      opremaSadrzaj.classList.contains("prosireno"),
    );

    if (opremaSadrzaj.classList.contains("prosireno")) {
      prikaziOpremu.innerHTML = "Prikaži manje <span>↓</span>";
    } else {
      prikaziOpremu.innerHTML = "Prikaži svu opremu <span>↓</span>";
    }
  });

  // KONTAKT SA SALONOM

  const pozoviSalon = document.querySelector("#pozoviSalon");
  const whatsappSalon = document.querySelector("#whatsappSalon");

  const poruka = `Pozdrav, zainteresovan sam za vozilo ${automobil.name}. ${window.location.href}`;
  const kontaktDugme = document.querySelector('.kontakt-dugme');
  if (salon.phone) {
    pozoviSalon.href = 'tel:' + salon.phone;
    kontaktDugme.href = '#kontakt-vozila';
  } else {
    pozoviSalon.hidden = true;
    kontaktDugme.href = '#kontakt-vozila';
    kontaktDugme.textContent = 'Informacije o kontaktu ↓';
  }
  if (salon.whatsapp) {
    whatsappSalon.href = 'https://wa.me/' + salon.whatsapp + '?text=' + encodeURIComponent(poruka);
  } else whatsappSalon.hidden = true;
  if (!salon.phone && !salon.whatsapp) {
    const note = document.createElement('p');
    note.textContent = 'Kontaktni podaci salona bit će objavljeni uskoro.';
    document.querySelector('.kontakt-dugmad').appendChild(note);
  }
}

if (automobil) {
// GALERIJA SLIKA

const glavnaSlika = document.querySelector(".glavna-slika img");
const ostaleSlike = document.querySelector(".ostale-slike");

const prethodnaSlika = document.querySelector("#prethodnaSlika");
const sljedecaSlika = document.querySelector("#sljedecaSlika");

let trenutnaSlika = 0;

// Sve slike automobila
const dostupneSlike = carImages(automobil);
const slikeAutomobila = dostupneSlike.length ? dostupneSlike : [placeholderImage];
prethodnaSlika.hidden = sljedecaSlika.hidden = slikeAutomobila.length < 2;
ostaleSlike.hidden = slikeAutomobila.length < 2;

// Funkcija za prikaz slike
function prikaziSliku(index) {
  trenutnaSlika = index;

  setResponsiveImage(glavnaSlika, slikeAutomobila[trenutnaSlika], galleryImageSizes);

  const sveSlike = ostaleSlike.querySelectorAll("img");

  sveSlike.forEach(function (slika, index) {
    slika.classList.remove("aktivna-slika");

    if (index === trenutnaSlika) {
      slika.classList.add("aktivna-slika");
    }
  });
}

// Dodavanje malih slika
slikeAutomobila.forEach(function (slika, index) {
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.setAttribute("aria-label", `Prikaži fotografiju ${index + 1}`);
  const novaSlika = document.createElement("img");
  novaSlika.loading = "lazy";

  novaSlika.src = imageVariant(slika)?.thumb || slika;
  novaSlika.decoding = 'async';
  novaSlika.alt = automobil.name;

  dugme.addEventListener("click", function () {
    prikaziSliku(index);
  });

  dugme.appendChild(novaSlika);
  ostaleSlike.appendChild(dugme);
});

// Prethodna slika
prethodnaSlika.addEventListener("click", function () {
  let noviIndex = trenutnaSlika - 1;

  if (noviIndex < 0) {
    noviIndex = slikeAutomobila.length - 1;
  }

  prikaziSliku(noviIndex);
});

// Sljedeća slika
sljedecaSlika.addEventListener("click", function () {
  let noviIndex = trenutnaSlika + 1;

  if (noviIndex >= slikeAutomobila.length) {
    noviIndex = 0;
  }

  prikaziSliku(noviIndex);
});

// Prikaz prve slike
prikaziSliku(0);

prepareImages();
}
