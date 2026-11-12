const fr = {
nav_services:"Services",nav_work:"Projets",nav_stack:"Technologies",nav_exp:"Expérience",nav_contact:"Contact",
h1:"Je conçois des applications métiers et les pipelines qui les livrent.",
lead:"Ingénieur full stack senior (Java, .NET, Angular) avec une pratique DevOps. 9 ans de conception, livraison et modernisation de logiciels web et mobiles sécurisés, basé à Dakar.",
cta1:"Démarrer un projet",cta2:"Télécharger le CV",
p3:"Contrôles CI à chaque push",p4:"Déploiement",p5:"En ligne",p5s:"Validé",
h_services:"Ce que je peux faire pour vous",
s1h:"Applications métiers sur mesure",s1:"Applications web sécurisées et hautement disponibles, avec des back ends Spring Boot ou .NET Core et des front ends Angular responsives.",
s2h:"CI/CD et DevOps",s2:"Pipelines automatisés de build, de test et de déploiement avec Azure DevOps, GitLab CI/CD et GitHub Actions, conteneurisés avec Docker.",
s3h:"API et intégrations",s3:"API REST, micro-services et intégrations tierces, notamment des solutions de paiement comme VISA, PayPal et Orange Money.",
s4h:"Modernisation et formation",s4:"Migration d'applications anciennes vers des architectures actuelles et accompagnement des équipes sur le code propre et les design patterns.",
h_work:"Projets sélectionnés",
c0r:"Consultant web, AlphaNumerika, 2021–2023",c0:"Site web d'un hôtel de Bangui : catégories de chambres avec tarifs, recherche de disponibilité et réservation en ligne, visites 3D des chambres, pages restaurant, bar et piscine, galerie photo et espace de gestion privé pour le personnel.",c0t1:"Réservation en ligne",c0t2:"Visite 3D des chambres",c0t3:"Espace de gestion",visit:"Voir le site",
c1r:"Tech lead et développeur full stack, 2020–2021",c1:"Une plateforme web avec paiement en ligne (VISA, PayPal, Orange Money). J'ai piloté la partie technique, réparti la charge de travail et assisté les développeurs.",
c2r:"Développeur full stack, 2020–2021",c2:"Une plateforme de mise en relation entre organismes de formation et apprenants. J'ai développé des fonctionnalités de bout en bout et les ai déployées sous Linux.",
c3h:"Plateformes e-commerce et e-billetterie",c3r:"Développeur full stack et .NET, 2016–2019",c3:"Boutique en ligne et plateformes de billetterie pour plusieurs clients à Dakar, avec intégration d'API tierces et bases de données relationnelles.",
c4h:"Hackathon CDP 2019 : protection des données",c4r:"Porteur du projet lauréat",c4:"Un projet de protection des données personnelles, lauréat du hackathon, que j'ai porté et présenté.",c4t:"Protection des données",
h_stack:"Technologies",t1:"Back end",t2:"Front end",t4:"Données",
h_exp:"Expérience",
e1d:"Nov. 2021 – Présent",e1h:"Consultant senior Full Stack (Java / .NET) & DevOps",e1:"Conception et maintenance d'applications web métiers sécurisées à haute disponibilité. Pipelines CI/CD sur Azure DevOps, services Spring Boot et .NET Core, administration de SQL Server, PostgreSQL, MySQL et MongoDB.",
e2d:"Mars 2021 – Déc. 2023",e2h:"Formateur en génie logiciel & consultant web",e2:"Enseignement de la POO Java / C#, des bonnes pratiques de codage et des design patterns. Développement de sites et d'applications métiers, suivi de recettes et rédaction de documentation technique. Parmi les projets : le site web de KM-Hôtel à Bangui.",
e3d:"Nov. 2020 – Mai 2021",e3h:"TechLead / Développeur Full Stack",e3:"Gestion technique du projet, répartition de la charge de travail et développement de la plateforme, dont les API de paiement VISA, PayPal et Orange Money.",
e4d:"Juil. 2020 – Mars 2021",e4h:"Développeur Full Stack",e4:"Développement de fonctionnalités d'une plateforme de formation avec Angular 8, Node.js, Laravel API et MySQL, déployée sous Linux.",
e5d:"Août 2016 – Fév. 2019",e5h:"Développeur Full Stack & .NET (stages et projets)",e5:"Plateformes e-commerce et e-billetterie avec Spring Boot, Angular, ASP.NET MVC et C#.",
h_edu:"Formation et distinctions",
d1h:"Master en Informatique Appliquée à la Gestion des Entreprises (MIAGE)",d1:"Groupe ISI, Dakar, 2020 (BAC+5). Licence (LIAGE) en 2018.",
d2h:"Hackathon CDP 2019",d2:"Lauréat porteur de projet, protection des données. Porteur du projet e-service Expresso à la Nuit de l'Informatique 2018.",
langs:"Langues : français (langue maternelle), anglais (bon niveau technique).",
h_contact:"Parlons de votre projet",avail:"Disponible pour des missions de conseil et de développement.",
f_name:"Nom",f_email:"E-mail",f_msg:"Message",f_send:"Envoyer le message"
};
const msg = {
 en:{ok:"Message sent. I'll reply soon.",err:"Could not send. Please email me directly.",mail:"Opening your email app…"},
 fr:{ok:"Message envoyé. Je vous réponds rapidement.",err:"Envoi impossible. Écrivez-moi directement par e-mail.",mail:"Ouverture de votre messagerie…"}
};
const els = [...document.querySelectorAll("[data-i18n]")];
els.forEach(e => e.dataset.en = e.textContent);
const titles = {en:document.title, fr:"Jason Mandabrandja – Ingénieur Full Stack & DevOps"};
const btn = document.getElementById("lang");
let lang = "en";
function setLang(l){
  lang = l;
  document.documentElement.lang = l;
  els.forEach(e => e.textContent = (l === "fr" && fr[e.dataset.i18n]) || e.dataset.en);
  document.title = titles[l];
  btn.textContent = l === "fr" ? "EN" : "FR";
  try { localStorage.setItem("lang", l); } catch (e) {}
}
btn.addEventListener("click", () => setLang(lang === "fr" ? "en" : "fr"));
let saved = null;
try { saved = localStorage.getItem("lang"); } catch (e) {}
setLang(saved || ((navigator.language || "").startsWith("fr") ? "fr" : "en"));

document.getElementById("y").textContent = new Date().getFullYear();

const form = document.getElementById("form"), status = document.getElementById("status");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const d = new FormData(form);
  if (d.get("company")) return;
  if (form.action.includes("YOUR_FORM_ID")) {
    const body = encodeURIComponent(d.get("message") + "\n\n" + d.get("name") + " (" + d.get("email") + ")");
    status.textContent = msg[lang].mail;
    location.href = "mailto:jasonmandabrandja@gmail.com?subject=" + encodeURIComponent("Portfolio contact") + "&body=" + body;
    return;
  }
  try {
    const r = await fetch(form.action, {method:"POST", body:d, headers:{Accept:"application/json"}});
    if (!r.ok) throw new Error();
    form.reset(); status.textContent = msg[lang].ok;
  } catch (err) { status.textContent = msg[lang].err; }
});
