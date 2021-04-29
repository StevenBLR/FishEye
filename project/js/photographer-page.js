
const filterDropdown = document.querySelectorAll(".dropdown");
console.log(filterDropdown);

filterDropdown.forEach(elt => {
    elt.addEventListener("mouseenter", function(e){
        //console.log("enter " + elt.id);
    });

    elt.addEventListener("mouseleave", function(e){
        //console.log("leave " + elt.id);
    })
})