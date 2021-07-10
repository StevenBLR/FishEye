// URL Parameters
var urlParams = new URLSearchParams(window.location.search);

// DOM Elements
var keywordsRoot = document.querySelector(".header__keywords");
var photographersRoot = document.querySelector(".photographers__list");
var tagsElts;

// var tl = gsap.timeline({repeat: 2, repeatDelay: 1});
// tl.to("#header__logo", {x: 100, duration: 1});
// tl.to("#header__logo", {y: 50, duration: 1});
// tl.to("#header__logo", {opacity: 0, duration: 1});


// Not Working ------------------------
// sort by value
// const mapSort1 = new Map([...allTags.entries()].sort((a, b) => b[1] - a[1]));
// console.log(mapSort1);

// Update heading tags with data infos
function PopulateHeaderTags(){
  keywordsRoot.innerHTML = "";
  allTags.forEach(t =>{ PopulateTag(t,keywordsRoot); })
}

// Update page with selected tag (without reloading)
function RefreshPage(clickedElt){
  currentTag = clickedElt.getAttribute('data-id');
  console.log("current tag = ",currentTag);
  // Reset all tags style and update clicked tag style
  // To iterate a child object, we need to use Array.prototype
  Array.prototype.forEach.call(keywordsRoot.getElementsByTagName('span'), elt => {
    elt.removeAttribute("id");
  });
  
  clickedElt.getElementsByTagName('span')[0].setAttribute("id", "selected");
  // Update photo
  PopulatePhotographers(currentTag);
  // Update style on other similar tags 
  document.querySelectorAll('a[data-id="'+ currentTag+'"] span').forEach(elt =>{
    elt.setAttribute("id","selected");
  }) 
}

// Update Html with selected photographers previews
function PopulatePhotographers(tagSelected = ""){

  // (1) Defining profils to display  ------------------------------------------------------------------------
  photographersRoot.innerHTML= "";
  var photographersToShow = photographers;
  urlParams = new URLSearchParams(window.location.search);

  // Check if URL has parameters 
  if (urlParams.has("tag")){
    tagSelected = urlParams.get("tag");
  }
  // Update profils with tag
  if(tagSelected != ""){
    photographersToShow = [];
    photographers.forEach(p => {
      if(p.tags.includes(tagSelected.toString())){
        photographersToShow.push(p);
      }
    });
  }

  // (2) Generation Profil Cards with datas ------------------------------------------------------------------------
  // Pour chaque profil
  photographersToShow.forEach(p => {
    var profilPreview = document.createElement("li");
    profilPreview.className = "photographers__profil-preview";
    var linkElt = document.createElement("a");
    linkElt.href = 'photographer-page.html?pid='+p.id;
    linkElt.className = 'photographers__profil-link';
    linkElt.setAttribute("alt", p.name);
    profilPreview.appendChild(linkElt);
    linkElt.innerHTML += '<img src="../imgs/low/Photographers ID Photos/'+ p.portrait +'" alt="" class="profil__pic">';
    linkElt.innerHTML += '<h2 class="profil__name">'+ p.name +'</h2>';
    profilPreview.innerHTML += '</a>';
    profilPreview.innerHTML += '<h3 class="profil__location">'+ p.city +', '+ p.country +'</h3>';
    profilPreview.innerHTML += '<p class="profil__bio">'+ p.tagline +'</p>';
    profilPreview.innerHTML += '<p class="profil__tjm">'+ p.price +'/jour</p>';
    profilPreview.innerHTML += '<ul class="profil__tags">';
    photographersRoot.appendChild(profilPreview);
    var profilTagsRoot = profilPreview.querySelector(".profil__tags");

    // (3) Add click events and behaviour ------------------------------------------------------------------------
    // Pour chaque tag inclus dans le profil
    p.tags.forEach(t => { PopulateTag(t,profilTagsRoot); });
  });
}

function PopulateTag(tagInfo, parent){
  const liElt = document.createElement('li');
  const tagLink = document.createElement('a');
  tagLink.href = "#";
  tagLink.setAttribute("class","tag");
  tagLink.setAttribute("alt","tag");
  tagLink.setAttribute("data-id",`${tagInfo}`);
  const spanElt = document.createElement("span");
  spanElt.textContent = `#${tagInfo}`;
  parent.appendChild(liElt);
  liElt.appendChild(tagLink);
  tagLink.appendChild(spanElt);

  function clickEvent(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    // Updating URL params
    window.history.pushState({page: 1}, "tag", `?tag=${tagInfo}`);
    RefreshPage(tagLink);
  }
  tagLink.addEventListener("click", clickEvent);
  return spanElt;
}

PopulateHeaderTags();
PopulatePhotographers();