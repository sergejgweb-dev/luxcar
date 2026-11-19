// Jedino mjesto za kontakt podatke. Prazno znači da podatak nije potvrđen.
const salon = { phone: "+38766146600", whatsapp: "", email: "luxcar.as25@gmail.com" };
const placeholderImage = "./slike/bez-fotografije.svg";
function formatPrice(price) {
  return typeof price === "number" && price > 0
    ? `${price.toLocaleString("de-DE")} KM` : "Cijena na upit";
}
function carId(car) {
  if (car.id) return car.id;
  return car.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function carImages(car) {
  return [...new Set([car.image, ...(car.images || [])])]
    .filter(src => src && src !== "#").map(src => src.replace(/^\.\.\//, "./"));
}
function prepareImages(root = document) {
  root.querySelectorAll("img").forEach(img => {
    const fallback = () => {
      if (!img.src.endsWith("bez-fotografije.svg")) img.src = placeholderImage;
    };
    img.addEventListener("error", fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });
}
function setupNavigation() {
  const footerContact = document.querySelector('#kontakt-podaci');
  if (footerContact && salon.email) {
    const email = document.createElement('a');
    email.href = 'mailto:' + salon.email;
    email.textContent = salon.email;
    footerContact.appendChild(email);
  }
  if (footerContact && salon.phone) {
    const line = footerContact.querySelector('p:not(.footer-heading)');
    if (line) {
      const link = document.createElement('a');
      link.href = 'tel:' + salon.phone;
      link.textContent = salon.phone;
      line.replaceWith(link);
    }
    const cta = document.querySelector('.kontakt-button');
    if (cta) cta.href = 'tel:' + salon.phone;
  }
  const button = document.querySelector("#hamburger");
  const nav = document.querySelector("#mobile-nav");
  if (!button || !nav) return;
  function close() {
    nav.classList.remove("is-open");
    button.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  }
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    button.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
}
