window.INVITADOS = [
  "Meribeth Puello y Juliana Mesa",
  "Juan Otero y Rina Flores",
  "Robert Orozco y Rosa Martínez",
  "Walberto Orozco, Andreina Jiménez y Sara Orozco",
  "Samuel Orozco, Belia Orozco y Samuel Orozco",
  "Greis Marriaga",
  "William Torne, Katiuska Castillo y Miliam Torne",
  "Rosana Pizarro, Óscar Reyes y Samuel Reyes",
  "Heidi Henao, César Henao y María Orozco",
  "Sergio Alejandro Salazar y Mari Bueno",
  "Julián Capó y Jesús Barro",
  "Vanessa Caraballo y Carlos Siachoque",
  "Sergio Cruzado, Maireth Giménez, Shaireth Cruzado y Saileth Cruzado",
  "Luis Osorio y Estela Gracia",
  "Luis Galán, Karen Cervantes y Alejandro Galán",
  "Pablo Gómez, Milena Calvo, Gustavo Gómez y Saith Gómez",
  "Farak Viana, Liliana Muñoz y Jesús Viana",
  "Maicol Coronel, Gina Vázquez y Andrea Vaina",
  "Katiuska Zapata, Marcelo Rodríguez y Argeni Quiepo",
  "Jackeline Orozco y Orlando Ferrer",
  "Luis Mejía, Isleny Figueroa y Alana Cova",
  "Luci Mejía y Martín Mejía",
  "Mauricio Ocampo, Yoelin Meléndez y Keinner Reyes",
  "Merys Vargas y Yuer Rodríguez",
  "Adriana Junco y Walter (esposo)",
  "Erasmo Mejía y Carmen Charris",
  "Rubén Correa y Judith Soto",
  "Sandra M. Salazar y Gerson Correa",
  "Elizabeth C. Correa, esposo y Sara Juanita",
  "Rubén Palacios",
  "Rubén Darío Correa Soto",
  "Zulma Inés Correa Reyes y Jeovel Correa",
  "Henry Rojas y Patricia Soto",
  "Jhon Baruc Soto y Nancy Collazos",
  "Óscar Africano y esposa",
  "Julián Andrés Salazar Valencia",
  "Robert Naun Soto Orozco",
  "Celina Orozco",
  "Luis Guillermo Muñoz Sánchez, esposa e hija",
];

window.padId = (n) => String(n).padStart(2, "0");

window.SITE_BASE = "https://factoryil.github.io/BABYSHOWER";

window.guestLink = (index) =>
  `${window.SITE_BASE}/carta#${window.padId(index + 1)}`;

window.getGuestIndex = (id) => {
  const n = parseInt(String(id || "").replace(/\D/g, ""), 10);
  if (!n || n < 1 || n > window.INVITADOS.length) return null;
  return n - 1;
};
