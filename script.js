/*const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");*/
function bindNav() {
  const navButton = document.getElementById("hamburgerMenu");
  const navMenu = document.getElementById("primaryNav");
  if (!navButton || !navMenu) return;


  // ⚠️ ChatGPT AJOUT évite les doubles listeners si bindNav() est rappelé
  if (navButton.dataset.bound === "1") return;
  navButton.dataset.bound = "1";

  function openNavigation() {
    navButton.setAttribute("aria-expanded", "true");
    navMenu.hidden = false;
    navButton.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  function closeNavigation() {
    navButton.setAttribute("aria-expanded", "false");
    navMenu.hidden = true;
    navButton.classList.remove("active");
    navMenu.classList.remove("active");
  }


  navButton.addEventListener("click", () => {
    const expanded = navButton.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeNavigation();
    } else {
      openNavigation();
    }
  })
}
/*hamburger.addEventListener("click",()=>{
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})*/

class SimpleTemplateEngine {
  
  constructor(template_url) {
    this.template_url = template_url;
  }

  loadTemplate() {
    return fetch(this.template_url)
    .then(response => response.text())
    .then(text => {
      this.template = text;
    })
  }

  renderTemplate(tag_id, data) {
    const tag = document.getElementById(tag_id);

    let output = this.template
    
    // Gérer les blocs {{#each tableau}}...{{/each}}
    output = output.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, templateFragment) => {
      const listOfThings = data[arrayName];
      
      if (!Array.isArray(listOfThings)) {
        return '';
      }

      return listOfThings.map(item => this.replaceVariablesInFragment(templateFragment,item)).join("")})
    

    output = output.replace(/{{(\w+)}}/g,(match,dataField)=> {
      return data[dataField]
    })

    tag.innerHTML = output
  }

  replaceVariablesInFragment(templateFragment, data) {
    // Calcule les ratios
    const ratio_high = data.high_speed / data.total;
    const ratio_very_high = data.very_high_speed / data.total;
    const ratio_fibre = data.fibre_ftth / data.total;

    // Fonction pour déterminer la classe couleur
    function getColor(ratio) {
      if (ratio > 0.7) return 'green';
      if (ratio > 0.3) return 'yellow';
      return 'red';
    }

    // Applique les classes couleurs
    const colorVars = {
      color_high_speed: getColor(ratio_high),
      color_very_high_speed: getColor(ratio_very_high),
      color_fibre_ftth: getColor(ratio_fibre)
    };
    
    return templateFragment.replace(/{{(\w+)}}/g, (match, dataKey) => {
    if (colorVars[dataKey]) return colorVars[dataKey];
    return data[dataKey];
    });
  }
}

//if(contentTag) to manage the error for page 2 which has not 
const contentTag = document.getElementById("content");
if (contentTag) {
  const tEngine = new SimpleTemplateEngine("template.html");

  Promise.all([
    tEngine.loadTemplate(),
    fetch('Page3.json').then(res => res.json())
  ])
  .then(([_, data])=>{
    tEngine.renderTemplate("content",data); // injecte le template brut dans le DOM
    bindNav()
  })

}
// //function for 2 columns inside table
// function renderSharesTable(list) {
//   const items = (list || [])
//     .sort((a,b) => b.value - a.value)           // tri décroissant (optionnel)
//     .map(s => `${s.provider}: ${s.value}%`);

//   let rows = "";
//   for (let i = 0; i < items.length; i += 2) {
//     const left  = items[i]     || "";
//     const right = items[i + 1] || "";
//     rows += `<tr><td>${left}</td><td>${right}</td></tr>`;
//   }
//   return `<table class="shares-table"><tbody>${rows}</tbody></table>`;
// }

document.addEventListener("DOMContentLoaded", () => {
  bindNav()
  fetchPeriods();
});

function fetchPeriods() {
  fetch("http://localhost:3000/api/periods")
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector("#market-share tbody");
    tbody.innerHTML = data.map(period => {
      const shares = (period.market_share || [])
      .map(s => `${s.provider}: ${s.value}%`)
      .join(", ");
      return `
      <tr> 
        <td>${period.year}</td>
        <td>${period.total_of_subscribers} ${period.subscribers_unit}</td>
        <td>${shares}</td>
      </tr>`;
      }).join("");
    })
  .catch(error => console.error('Error fetching periods:', error));
}

