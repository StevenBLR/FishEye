console.clear();
const filterDropdown = document.querySelectorAll(".dropdown");
const filterBts = document.querySelectorAll(".dropdown button");
const ddAnimSpeed = 0.5;

// const ddAnim = gsap.timeline({reversed: true, paused:true})
// .to(".dropdown", {height: "auto", duration: 1.5})

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