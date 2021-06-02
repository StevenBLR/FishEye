class Photographer{
  constructor(name, id, city, country, tags, tagline, price, portrait){
      this.name = name;
      this.id = id;
      this.city = city;
      this.country = country;
      this.tags = tags;
      this.tagline = tagline;
      this.price = price;
      this.portrait = portrait;
  }
}

class Media{
  constructor(id, photographerId, image, video, tags, likes, date, price){
      this.id = id;
      this.photographerId = photographerId;
      this.image = image;
      this.video = video;
      this.tags = tags;
      this.likes = likes;
      this.date = date;
      this.price = price;
  }
}

const ddAnimSpeed = 0.5;
var photographers = [];
var medias = [];
var allTags = [];

// Overview Elements 
const nameElt = document.querySelector(".profil__name");
const locationElt = document.querySelector(".profil__location");
const bioElt = document.querySelector(".profil__bio");
const tagsRootElt = document.querySelector(".profil__tags");
const profilPicElt = document.querySelector(".profil__pic");
const profilContactBtElt = document.querySelector(".profil__contact-bt");

// Media feed Elements
const filterDropdown = document.querySelectorAll(".dropdown");
const filterBts = document.querySelectorAll(".dropdown button");
const feedRootElt = document.querySelector(".media-feed__medias-grid");

// Media modal Elements
const modalImgElt = document.querySelector(".media-modal img");
const modalElt = document.querySelector(".media-modal");
const modalBgElt = document.querySelector(".media-modal__bg");

// Store every data from Json into 2 objects --> photographers[] / medias[]
function GetJsonData(data){
    photographersData.photographers.forEach(u => {
      var newUser = new Photographer(u.name, u.id, u.city, u.country, u.tags, u.tagline, u.price, u.portrait);
      photographers.push(newUser);
    });

    photographersData.media.forEach(m => {
      var newMedia = new Media(m.id, m.photographerId, m.image, m.video, m.tags, m.likes, m.date, m.price);
      medias.push(newMedia);
    });
}


function GetAllTags(){
    medias.forEach(m => {
        m.tags.forEach(t => {
            if (!allTags.includes(t.toString())){
                allTags.push(t);
            }
        })
    })
}
const ddAnim = gsap.timeline({reversed: true, paused:true})
.to(".dropdown", {height: "auto", duration: 1.5})

// gsap.timeline()
// .to(".dropdown", {height: "auto", duration: 1.5});

filterDropdown.forEach(elt => {
    elt.addEventListener("mouseenter", function(e){
        toggleDropdown();
        gsap.to(".dropdown", {height: 120, duration: ddAnimSpeed, ease: "expo"});
        e.stopImmediatePropagation();
    });

    elt.addEventListener("mouseleave", function(e){
        //console.log("leave " + elt.id);
        gsap.to(".dropdown", {height: 40, duration: ddAnimSpeed, ease: "expo"})
            //.to("");
        // toggleDropdown()
        e.stopImmediatePropagation();
    })
})

function toggleDropdown(){
    //ddAnim.reversed() ? ddAnim.play() : ddAnim.reverse();
}

function PopulateProfilPage(pid = ""){
    // (1) Defining profils to display  ------------------------------------------------------------------------
    urlParams = new URLSearchParams(window.location.search);
    tagsRootElt.textContent = "";
    var profilFound = false;
    // Check if URL has parameters 
    if (urlParams.has('pid')){
        pid = urlParams.get('pid');
        photographers.forEach(p => {
    // (2) Find matching profil data to populate UI  ------------------------------------------------------------------------
            if(p.id == pid){
                profilFound = true;
                console.log(`Profil found : ${p.image}`);
                PopulateOverview(p);
                PopulateMediaFeed(p);
            }
        })
        if (!profilFound){
            console.error("No matching profil was found");
        }
    }
    else{ console.error("No profil to load");}
}

function DisplayMedia(mid = ""){
  // (1) Defining media to display  ------------------------------------------------------------------------
  urlParams = new URLSearchParams(window.location.search);
  var mediaFound = false;
  var isVideo = false;
  // Check if URL has parameters 
  if (urlParams.has('mid')){
  // (2) Find matching profil data to populate UI  ------------------------------------------------------------------------
    mid = urlParams.get('mid');
    medias.forEach(m => {
        if(m.id == mid){
            let firstName = photographers.find(p => p.id == m.photographerId).name.split(" ")[0];
            mediaFound = true;
            // Check if media is an image or a video
            if(m.video != undefined){
              //Populate video section
              isVideo = true;
              var videoElt = document.createElement("video");
              videoElt.src = `../imgs/${firstName}/${m.video}`;
              videoElt.alt = m.video;
              videoElt.setAttribute("type","video/mp4");
            }
            else if(m.image != undefined){
              //Populate image section
              //conoso
              var imgElt = document.createElement("img");
              imgElt.src = `../imgs/${firstName}/${m.image}`;
              imgElt.alt = m.image;
            }
            //modalImgElt.src = `../im`;
            ShowModal(true);
            console.log(`Media found : ${m.id}`);
        }
    })
    if (!mediaFound){
        console.error("No matching profil was found");
    }
}
else{ console.error("No profil to load");}
}

function PopulateTag(tagInfo, parent){
    const liElt = document.createElement('li');
    const tagLink = document.createElement('a');
    tagLink.href = "#";
    tagLink.setAttribute("class","tag");
    tagLink.setAttribute("data-id",`${tagInfo}`);
    const spanElt = document.createElement("span");
    spanElt.textContent = `#${tagInfo}`;
    parent.appendChild(liElt);
    liElt.appendChild(tagLink);
    tagLink.appendChild(spanElt);
    return spanElt;
  }

function PopulateOverview(profilData){
    profilData.tags.forEach(t => { PopulateTag(t,tagsRootElt); });
    console.log(profilData);
    nameElt.textContent = profilData.name;
    profilContactBtElt.textContent = "Contactez-moi";
    
    locationElt.textContent = profilData.city;
    bioElt.textContent = profilData.tagline;
    profilPicElt.setAttribute("src", `../imgs/Photographers ID Photos/${profilData.portrait}`);
}

function PopulateMediaFeed(profilData){
    var pMedias = [];
    
    feedRootElt.textContent = "";
    let firstName = profilData.name.split(" ")[0];
    medias.forEach(m => {
        if(m.photographerId == profilData.id){
            pMedias.push(m);
        }
    })
    pMedias.forEach(pm => {
        var isVideo = false;
        var liElt = document.createElement("li");
        liElt.classList.add("media-card");
        var aElt = document.createElement("a");
        aElt.classList.add("media-card__link");
        aElt.href = `?pid=${pm.photographerId}&mid=${pm.id}`;

        function clickEvent(e){
          e.preventDefault();
          e.stopImmediatePropagation();
          // Updating URL params
          window.history.pushState({page: 1}, "media-id", aElt.href);
          DisplayMedia(pm.id);
          console.log(`Open media ${pm.name}`);
        }
        aElt.addEventListener("click", clickEvent);
        // Check if media is an image or a video
        if(pm.video != undefined){
          //Populate video section
          isVideo = true;
          var videoElt = document.createElement("video");
          videoElt.src = `../imgs/${firstName}/${pm.video}`;
          videoElt.alt = pm.video;
          videoElt.setAttribute("type","video/mp4");
        }
        else if(pm.image != undefined){
          //Populate image section
          var imgElt = document.createElement("img");
          imgElt.src = `../imgs/${firstName}/${pm.image}`;
          imgElt.alt = pm.image;
        }

        var spanTitleElt = document.createElement("span");
        spanTitleElt.classList.add("media-card__title");
        
        isVideo ? spanTitleElt.textContent = pm.video : spanTitleElt.textContent = pm.image;//CleanTitle(pm.image);
        var divLikesElt = document.createElement("div");
        divLikesElt.classList.add("media-card__likes");
        var spanLikesElt = document.createElement("span");
        spanLikesElt.classList.add("media-card__nb-likes");
        spanLikesElt.textContent = pm.likes;
        var iElt = document.createElement("i");
        iElt.classList.add("fas");
        iElt.classList.add("fa-heart");

        isVideo ? aElt.appendChild(videoElt) : aElt.appendChild(imgElt);
        divLikesElt.appendChild(spanLikesElt);
        divLikesElt.appendChild(iElt);
        liElt.appendChild(aElt);
        liElt.appendChild(spanTitleElt);
        liElt.appendChild(divLikesElt);
        feedRootElt.appendChild(liElt);
    })
    console.log(pMedias);
}

function CleanTitle(title){
    var newTitle;
    allTags.forEach(t => {
        if(title.toString().toUpperCase().includes(t.toString().toUpperCase())){
            console.log(`${title} contains ${t}`);
            newTitle = title.replace(`${t}_`,'');
        }
        else{
            newTitle = title;
        }
    })
    console.log(newTitle);
    return newTitle;
}

function ShowModal(on){
  on ? modalElt.style.display = "block" : modalElt.style.display = "none"; 
  on ? modalBgElt.style.display = "block" : modalBgElt.style.display = "none"; 
}

GetJsonData();
GetAllTags();
PopulateProfilPage();