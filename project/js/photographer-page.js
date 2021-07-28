// Overview Elements
const nameElt = document.querySelector(".profil__name");
const locationElt = document.querySelector(".profil__location");
const bioElt = document.querySelector(".profil__bio");
const tagsRootElt = document.querySelector(".profil__tags");
const profilPicElt = document.querySelector(".profil__pic");
const profilContactBtElt = document.querySelectorAll(".profil__contact-bt");

// Media feed Elements
const filterDropdown = document.querySelector(".dropdown");
var filterBts = document.querySelectorAll(".dropdown button");
const feedRootElt = document.querySelector(".media-feed__medias-grid");

// Media modal Elements
const modalImgElt = document.querySelector(".media-modal img");
const modalVideoElt = document.querySelector(".media-modal video")
const modalElt = document.querySelector(".media-modal");
const modalBgElt = document.querySelector(".media-modal__bg");
const modalLeftBtElt = document.querySelector(".media-modal #left-bt");
const modalRightBtElt = document.querySelector(".media-modal #right-bt");
const modalCloseBtElt = document.querySelector("#media-md-close-bt");
const modalTitleElt = document.querySelector(".media-modal__name");

// Contact modal Elements
const contactModalElt = document.querySelector(".contact-modal");
const contactCloseBtElt = document.querySelector("#contact-close-bt");
const contactModalTitleElt = document.querySelector(".contact-modal__title");

// Info label Elements
const txtNbLikesElt = document.querySelector(".info-label__nb-likes");
const txtTjmElt = document.querySelector(".info-label__tjm");

const filters = ["Popularity", "Date", "Title"];
const direction = ["Asc", "Desc"];
var mediaCarousel = [];

const ddAnimSpeed = 0.5;
var currentProfil;
var currentFilter;
var currentMedia;

const ddAnim = gsap.timeline({reversed: true, paused:true})
    .to(".dropdown", {height: "auto", duration: 1.5})

//#region Init
function Init(){
    currentFilter = "Popularity";
    GetUrlParams();
    InitFilterDropdown();
    InitMediaModal();
    InitContactModal();
}

function InitFilterDropdown(){
    var openingEvents = ["focus","mouseenter"];
    var closingEvents = ["blur","mouseleave","click"];
    filterBts.forEach(elt => {

        for(let i=0; i < openingEvents.length; i++){
            elt.addEventListener(openingEvents[i], function(e){
                //toggleDropdown();
                gsap.to(".dropdown", {height: 120, duration: ddAnimSpeed, ease: "expo"});
            });
        }
        for(let y=0; y < closingEvents.length; y++){
            elt.addEventListener(closingEvents[y], function(e){
                gsap.to(".dropdown", {height: 40, duration: ddAnimSpeed, ease: "expo"});
                if(closingEvents[y] == "click"){
                    SetMediaFilter(e.target.id)
                }
            })
        }
    })
}

function InitMediaModal(){
    var modalBts = [modalLeftBtElt, modalRightBtElt, modalCloseBtElt];
    var events = ["click","keyup"];
    // Init click and keyUp event
    modalBts.forEach(bt =>{
        for (var i=0; i < events.length; i++){
            if (bt == modalLeftBtElt){
                modalLeftBtElt.addEventListener(events[i], function(e){
                    console.log(" I = " + i);
                    if(events[i] == "keyup") PreviousMedia();
                    if(events[i] != "click") console.log(`keyup event. key property value is "${e.key}"`);
                });
            }
            if (bt == modalRightBtElt){
                modalRightBtElt.addEventListener(events[i], function(e){
                    if((events[i] == "keyup" && e.key == "ArrowRight") || (events[i] == "click")) NextMedia();
                    //if(events[i] != "click") console.log(`keyup event. key property value is "${e.key}"`);
                });
            }
            if(bt == modalCloseBtElt){
                modalCloseBtElt.addEventListener(events[i], function(e){
                    if((events[i] == "keyup" && e.key == "Escape") || (events[i] == "click")) ShowMediaModal(false);
                    //if(events[i] != "click") console.log(`keyup event. key property value is "${e.key}"`);
                });
            }
        }
    })

    // modalLeftBtElt.addEventListener("click", function(e){PreviousMedia()});
    // modalRightBtElt.addEventListener("click", function(e){NextMedia()});
    // modalCloseBtElt.addEventListener("click", function(e){ShowMediaModal(false)});

    // modalLeftBtElt.addEventListener('keyup', (e) => {
    //     console.log(`keyup event. key property value is "${e.key}"`);
    //   });
}

function InitContactModal(){
    profilContactBtElt.forEach(elt => elt.addEventListener("click",function(e){ShowContactModal(true)}));
    contactCloseBtElt.addEventListener("click", function(e){ShowContactModal(false)});
    contactModalTitleElt.textContent = `Contactez-moi ${currentProfil.name}`;
}
//#endregion

// Display previous media
function PreviousMedia(){
    var currentIndex = mediaCarousel.indexOf(currentMedia);
    if (currentIndex > 0) DisplayMedia(mediaCarousel[currentIndex-1].id);
    else DisplayMedia(mediaCarousel[mediaCarousel.length-1].id);
}

// Display next media
function NextMedia(){
    var currentIndex = mediaCarousel.indexOf(currentMedia);
    if (currentIndex < mediaCarousel.length-1) DisplayMedia(mediaCarousel[currentIndex+1].id);
    else DisplayMedia(mediaCarousel[0].id);
}

function SetMediaFilter(filter){
    if(filters.find(f => filter)){
        PopulateMediaFeed(currentProfil, filter);
        ResetFilterDropdown(filter);
    }
}

function ResetFilterDropdown(currentFilter){
    //filterDropdown.insertBefore(filterBts.find(f => f.id == currentFilter),filterDropdown);
    filterDropdown.innerHTML = "";
    const newFilters = [];
    newFilters.push(currentFilter);
    filters.filter(f => f != currentFilter).forEach(f => newFilters.push(f));

    console.log(newFilters);
    console.log("reset dd ui");
    for (var i=0; i < filters.length; i++){
        filterDropdown.innerHTML +=
        `
            <li>
                <button class="" id="${newFilters[i]}">
                <p>${newFilters[i]}</p>
                ${i == 0 ? '<i class="fas fa-chevron-up"></i>' : ""}
                </button>
            </li>
        `
    }
    filterBts = document.querySelectorAll(".dropdown button");
    InitFilterDropdown();

}

function GetUrlParams(){
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
                currentProfil = p;
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
  console.log(`mid = ${mid}`);
  var mediaFound = false;
  var isVideo = false;

  // Check if an id has been received
  if(mid != ""){}
  // If not Check if URL has parameters
  else if (urlParams.has('mid')) mid = urlParams.get('mid');
  else {
    console.error("No profil to load");
    return;
  }

  // (2) Find matching profil data to populate UI  ------------------------------------------------------------------------
    medias.forEach(m => {
        if(m.id == mid){
            mediaFound = true;
            title = "";
            currentMedia = m;
            // Check if media is an image or a video
            if(m.video != undefined){
              //Populate video section
              isVideo = true;
              var videoElt = document.createElement("video");
              videoElt.src = GetMediaPath(mid, "low");
              videoElt.alt = "Lilac breasted roller";
              videoElt.setAttribute("type","video/mp4");
              videoElt.setAttribute("aria-label","Lilac breasted roller");
            }
            else if(m.image != undefined){
              //Populate image section
              var imgElt = document.createElement("img");
              imgElt.src = GetMediaPath(mid, "low");
              imgElt.alt = "Lilac breasted roller";
            }
            if (isVideo){
                modalImgElt.style.display = "none";
                modalVideoElt.style.display = "block";
                modalVideoElt.src = GetMediaPath(mid);
                title = GetMediaPath(mid);
            }
            else{
                modalVideoElt.style.display = "none";
                modalImgElt.style.display = "block";
                modalImgElt.src = GetMediaPath(mid);
            }
            modalTitleElt.textContent = GetMediaPath(mid, "low");
            ShowMediaModal(true);
            console.log(`Media found : ${m.id}`);
        }
    })
    if (!mediaFound){
        console.error("No matching profil was found");
    }
}

//#region Populate systems

function PopulateProfilPage(){
    if (currentProfil != undefined){
        PopulateOverview(currentProfil);
        PopulateMediaFeed(currentProfil);
        PopulateInfoLabel(currentProfil);
    }
    // Error Page
}

function PopulateTag(tagInfo, parent){
    const liElt = document.createElement('li');
    const tagLink = document.createElement('a');
    tagLink.href = `index.html?tag=${tagInfo}`;
    tagLink.setAttribute("class","tag");
    tagLink.setAttribute("alt","tag");
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
    //console.log(profilData);
    nameElt.textContent = profilData.name;
    profilContactBtElt.textContent = "Contactez-moi";

    locationElt.textContent = profilData.city;
    bioElt.textContent = profilData.tagline;
    profilPicElt.setAttribute("src", `../imgs/low/Photographers ID Photos/${profilData.portrait}`);
    profilPicElt.setAttribute("alt", profilData.name);
}

function PopulateMediaFeed(profilData, filter = ""){
    if(filter == "") filter = currentFilter;
    var pMedias = GetOrderedMedias(filter,profilData.id);
    mediaCarousel = pMedias;

    feedRootElt.textContent = "";
    console.log(profilData.name);
    let firstName = profilData.name.split(" ")[0];
    pMedias.forEach(pm => {
        var isVideo = false;
        var liElt = document.createElement("li");
        liElt.classList.add("media-card");
        var aElt = document.createElement("a");
        aElt.classList.add("media-card__link");
        aElt.href = `?pid=${pm.photographerId}&mid=${pm.id}`;
        //aElt.setAttribute("alt",profilData.name)

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
          videoElt.src = `../imgs/low/${firstName}/${pm.video}`;
          videoElt.alt = pm.video;
          videoElt.setAttribute("type","video/mp4");
        }
        else if(pm.image != undefined){
          //Populate image section
          var imgElt = document.createElement("img");
          imgElt.src = `../imgs/low/${firstName}/${pm.image}`;
          imgElt.alt = pm.image;
          //console.log(pm.image.toString().split(firstName));
        }

        var infoRootElt = document.createElement("div");
        infoRootElt.classList.add("media-card__infos");

        var titleElt = document.createElement("p");
        titleElt.classList.add("media-card__title");

        isVideo ? titleElt.textContent = CleanTitle(pm.video) : titleElt.textContent = CleanTitle(pm.image);//CleanTitle(pm.image);
        var divLikesElt = document.createElement("div");
        divLikesElt.classList.add("media-card__likes");
        var spanLikesElt = document.createElement("span");
        spanLikesElt.classList.add("media-card__nb-likes");
        spanLikesElt.textContent = pm.likes;
        var iElt = document.createElement("i");
        iElt.setAttribute("aria-label","likes");
        iElt.classList.add("fas");
        iElt.classList.add("fa-heart");

        isVideo ? aElt.appendChild(videoElt) : aElt.appendChild(imgElt);
        divLikesElt.appendChild(spanLikesElt);
        divLikesElt.appendChild(iElt);
        infoRootElt.appendChild(titleElt);
        infoRootElt.appendChild(divLikesElt);
        liElt.appendChild(aElt);
        liElt.appendChild(infoRootElt);
        feedRootElt.appendChild(liElt);
    })
}

function PopulateInfoLabel(profilData){
    txtNbLikesElt.textContent = GetTotalLikes(profilData.id);
    txtTjmElt.textContent = `${GetTJM(profilData.id)}€/jour`;
}

//#endregion

function CleanTitle(title){
    var newTitle = "";
    // Delete extension - Split avec ".", suppression avec -1 pour prendre le . et raccordement du str join
    newTitle = title.split('.').slice(0,-1).join('.');
    // if(title.includes("jpg")){
    //     newTitle = title.split(".jpg");
    // }
    // if(title.includes("mp4")){
    //     newTitle = title.split(".mp4");
    // }
    // Clean tag
    //newTitle = newTitle.split("_").splice(0,);

    //var tmp1 = newTitle.toString().split("_").shift();
    //tmp1.join(" ");
    //newTitle.shift(); // Delete first element
    //console.log(tmp1);
    //newTitle.pop();
    // Space between words
    //newTitle = newTitle.join(' ');
    //
    // newTitle.join(" ");
    // console.log(newTitle)
    // allTags.forEach(t => {
    //     if(title.toUpperCase().includes(t.toString().toUpperCase())){
    //         console.log(`${title} contains ${t}`);
    //         newTitle = newTitle.split('_').splice(0,t.length+1).join('_');
    //         //newTitle = title.replace(`${t}_`,'');
    //     }
    // })
    // console.log(newTitle);
    return newTitle;
}

function ShowMediaModal(on){
  on ? modalElt.style.display = "block" : modalElt.style.display = "none";
  on ? modalBgElt.style.display = "block" : modalBgElt.style.display = "none";
  if(on) {
    modalLeftBtElt.focus();
  }
}

function ShowContactModal(on){
    on ? contactModalElt.style.display = "flex" : contactModalElt.style.display = "none"
    on ? modalBgElt.style.display = "block" : modalBgElt.style.display = "none";
    if(on) contactCloseBtElt.focus();
}



Init();
PopulateProfilPage();
//GetOrderedMedias("Popularity", currentProfil.id, "Desc");
