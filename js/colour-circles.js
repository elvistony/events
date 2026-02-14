for (const circle of document.querySelectorAll('.color-circle')) {
    console.log(circle)
    console.log("Change to","#"+ circle.href.split('/#')[1])
    circle.style.backgroundColor = "#"+ circle.href.split('/#')[1]
}