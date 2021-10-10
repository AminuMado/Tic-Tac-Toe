const mainContainer = document.querySelector(".main-container");
function createDiv(){
    for( let i = 0; i < 9; i++){
        const createDiv = document.createElement("div");
        mainContainer.appendChild(createDiv);
        createDiv.setAttribute("data-Id", i);
        createDiv.classList.add("grid-cell");    
    };
}
createDiv();