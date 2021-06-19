// Overview Elements 
const nameElt = document.querySelector(".profil__name");
const locationElt = document.querySelector(".profil__location");
const bioElt = document.querySelector(".profil__bio");
const tagsRootElt = document.querySelector(".profil__tags");
const profilPicElt = document.querySelector(".profil__pic");
const profilContactBtElt = document.querySelector(".profil__contact-bt");

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
const modalCloseBtElt = document.querySelector(".media-modal #close-bt");
const modalTitleElt = document.querySelector(".media-modal__name");

// Contact modal Elements
const contactModalElt = document.querySelector(".contact-modal");
const contactCloseBtElt = document.querySelector(".contact-modal #close-bt");

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

// gsap.timeline()
// .to(".dropdown", {height: "auto", duration: 1.5});

function Init(){
    currentFilter = "Popularity";
    GetUrlParams();
    InitFilterDropdown();
    InitMediaModal();
    InitContactBt();
}

function InitFilterDropdown(){
    var openingEvents = ["focus","mouseenter"];
    var closingEvents = ["blur","mouseleave","click"];
    filterBts.forEach(elt => {

        for(let i=0; i < openingEvents.length; i++){
            elt.addEventListener(openingEvents[i], function(e){
                //toggleDropdown();
                gsap.to(".dropdown", {height: 120, duration: ddAnimSpeed, ease: "expo"});
                //e.stopImmediatePropagation();
            });
        }
        for(let y=0; y < closingEvents.length; y++){
            elt.addEventListener(closingEvents[y], function(e){
                gsap.to(".dropdown", {height: 40, duration: ddAnimSpeed, ease: "expo"});
                if(closingEvents[y] == "click"){
                    SetMediaFilter(e.target.id)
                }
                //e.stopImmediatePropagation();
            })
        }
    })
}

function InitMediaModal(){
    modalLeftBtElt.addEventListener("click", function(e){PreviousMedia()});
    modalRightBtElt.addEventListener("click", function(e){NextMedia()});
    modalCloseBtElt.addEventListener("click", function(e){ShowMediaModal(false)});
}

function InitContactBt(){
    profilContactBtElt.addEventListener("click",function(e){ShowContactModal(true)});
    contactCloseBtElt.addEventListener("click", function(e){ShowContactModal(false)});
}

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
    for (var i =0; i < filters.length; i++){
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

// function toggleDropdown(){
//     ddAnim.reversed() ? ddAnim.play() : ddAnim.reverse();
// }

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

function PopulateProfilPage(){
    if (currentProfil != undefined){
        PopulateOverview(currentProfil);
        PopulateMediaFeed(currentProfil);
        PopulateInfoLabel(currentProfil);
    }
    else{
        // Error Page
    }
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
              videoElt.alt = m.video;
              videoElt.setAttribute("type","video/mp4");
            }
            else if(m.image != undefined){
              //Populate image section
              var imgElt = document.createElement("img");
              imgElt.src = GetMediaPath(mid, "low");
              imgElt.alt = m.image;
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

function PopulateTag(tagInfo, parent){
    const liElt = document.createElement('li');
    const tagLink = document.createElement('a');
    tagLink.href = `index.html?tag=${tagInfo}`;
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
    //console.log(profilData);
    nameElt.textContent = profilData.name;
    profilContactBtElt.textContent = "Contactez-moi";
    
    locationElt.textContent = profilData.city;
    bioElt.textContent = profilData.tagline;
    profilPicElt.setAttribute("src", `../imgs/low/Photographers ID Photos/${profilData.portrait}`);
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
        }

        var infoRootElt = document.createElement("div");
        infoRootElt.classList.add("media-card__infos");

        var titleElt = document.createElement("p");
        titleElt.classList.add("media-card__title");
        
        isVideo ? titleElt.textContent = pm.video : titleElt.textContent = pm.image;//CleanTitle(pm.image);
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

function CleanTitle(title){
    var newTitle = "";
    newTitle = title.split("_")[0] = "";
    console.log(newTitle)
    // allTags.forEach(t => {
    //     if(title.toString().toUpperCase().includes(t.toString().toUpperCase())){
    //         console.log(`${title} contains ${t}`);
    //         newTitle = title.replace(`${t}_`,'');
    //     }
    //     else{
    //         newTitle = title;
    //     }
    // })
    // console.log(newTitle);
    return newTitle;
}

function ShowMediaModal(on){
  on ? modalElt.style.display = "block" : modalElt.style.display = "none"; 
  on ? modalBgElt.style.display = "block" : modalBgElt.style.display = "none"; 
}

function ShowContactModal(on){
    on ? contactModalElt.style.display = "flex" : contactModalElt.style.display = "none"
    on ? modalBgElt.style.display = "block" : modalBgElt.style.display = "none"; 
}

Init();
PopulateProfilPage();
//GetOrderedMedias("Popularity", currentProfil.id, "Desc");
