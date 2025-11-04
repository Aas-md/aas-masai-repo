let select = document.getElementById("theme-selector");
select.addEventListener("change", (e) => {
   
    sessionStorage.setItem("theme", e.target.value);
    changeTheme();
});

changeTheme();

function changeTheme() {
    let theme = sessionStorage.getItem("theme") || "light";
    document.body.style.backgroundColor = theme;
    if(theme == "black" || theme == "blue"){
        document.body.style.color = "white";
    }else{
        document.body.style.color = "black";
    }
}




