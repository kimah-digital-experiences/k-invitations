import { templates } from "./templates/index.js";

const templateGrid = document.querySelector("[data-template-grid]");
const cardTemplate = document.querySelector("#experience-card");

for (const experience of templates) {
  const card = cardTemplate.content.cloneNode(true);
  const image = card.querySelector("img");
  const title = card.querySelector("h2");
  const description = card.querySelector("p");
  const launch = card.querySelector("a");

  image.src = experience.image;
  image.alt = `Vista previa de ${experience.name}`;
  title.textContent = experience.name;
  description.textContent = experience.description;
  launch.href = experience.launchUrl;
  launch.setAttribute("aria-label", `Launch ${experience.name}`);
  templateGrid.append(card);
}
