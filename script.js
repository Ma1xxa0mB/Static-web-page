const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click",()=>{
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

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

const tEngine = new SimpleTemplateEngine("template.html");

Promise.all([
  tEngine.loadTemplate(),
  fetch('data.json').then(res => res.json())
])
.then(([_, data])=>{
  console.log("template + data loaded")
  tEngine.renderTemplate("content",data); // injecte le template brut dans le DOM
})





// fetch('./data.json')
//   .then(res => res.json())
//   .then(data => {
//     const source = document.getElementById('access-template').innerHTML;
//     const template = Handlebars.compile(source);
//     const html = template(data);
//     document.getElementById('access-stats').innerHTML = html;
//   });

// Handlebars.registerHelper("getColor", function (value, total) {
//   const ratio = value / total;
//   if (ratio > 0.7) return "strong";
//   if (ratio > 0.4) return "medium";
//   if (ratio > 0.1) return "weak";
//   return "minimal";
// });