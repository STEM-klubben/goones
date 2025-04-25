function changeStatus (game) {
    let newStatus = (game.dataset.isActive != "true");
    game.dataset.isActive = newStatus;
    if (newStatus) {
        var bgColor = "lime";
    } else {
        var bgColor = "red";
    }
    game.children[0].style.backgroundColor = bgColor;
    
}