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
const cardImageSizes = '(min-width: 1400px) calc((100vw - 445px) / 3), (min-width: 1024px) calc((100vw - 420px) / 2), calc(100vw - 40px)';
const galleryImageSizes = '(min-width: 1400px) 725px, (min-width: 1000px) 54vw, 90vw';
function imageVariant(src) {
  return typeof responsiveImages !== 'undefined' ? responsiveImages[src] : null;
}
function imageSourceSet(src) {
  const variant = imageVariant(src);
  return variant ? variant.sources.map(item => `${item.src} ${item.width}w`).join(', ') : '';
}
function imageSmallSource(src) {
  return imageVariant(src)?.sources[0].src || src;
}
function setResponsiveImage(img, src, sizes) {
  const variant = imageVariant(src);
  if (variant) {
    img.sizes = sizes;
    img.srcset = imageSourceSet(src);
    img.width = variant.width;
    img.height = variant.height;
  } else {
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
  }
  img.decoding = 'async';
  img.src = imageSmallSource(src);
}
function prepareImages(root = document) {
  root.querySelectorAll("img").forEach(img => {
    const fallback = () => {
      if (!img.src.endsWith("bez-fotografije.svg")) {
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.src = placeholderImage;
      }
    };
    img.addEventListener("error", fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });
}
function setupNavigation() {
  const footerContact = document.querySelector('#kontakt-podaci');
  if (footerContact && salon.email && !footerContact.querySelector('a[href^="mailto:"]')) {
    const email = document.createElement('a');
    email.href = 'mailto:' + salon.email;
    email.textContent = salon.email;
    footerContact.appendChild(email);
  }
  if (footerContact && salon.phone && !footerContact.querySelector('a[href^="tel:"]')) {
    const line = footerContact.querySelector('p:not(.footer-heading)');
    if (line) {
      const link = document.createElement('a');
      link.href = 'tel:' + salon.phone;
      link.textContent = salon.phone;
      line.replaceWith(link);
    }
  }
  const cta = document.querySelector('.kontakt-button');
  if (cta && footerContact) cta.href = '#kontakt-podaci';
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
