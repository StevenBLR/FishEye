
const filterDropdown = document.querySelectorAll(".dropdown");
console.log(filterDropdown);

// const ddAnim = gsap.timeline({reversed: true, paused:true})
// .set(".open", {autoAlpha:0})
// .to(".test", {height: "auto", duration: 1.5})
// .from(".list", {autoAlpha:0, x:50, duration:1}, '-=1')

filterDropdown.forEach(elt => {
    elt.addEventListener("mouseenter", function(e){
        //console.log("enter " + elt.id);
        //let 
        gsap.to(".dropdown", {height: 123, duration: 1, ease: "expo"});
    });

    elt.addEventListener("mouseleave", function(e){
        //console.log("leave " + elt.id);
        gsap.to(".dropdown", {height: 40, duration: 1, ease: "expo"});
    })
})

function initFilters(){
    
}

initFilters();