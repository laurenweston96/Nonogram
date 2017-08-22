var state = 'colour';
var sol = [1,1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,0,1,0,1,1,0,1, 1,0,0,0,1,0,1,0, 1,0,0,1,0,0,1,1, 1,0,0,1,0,1,1,0, 0,1,0,1,1,1,0,0, 1,1,1,1,0,0,0,0, 1,0,1,1,0,1,0,1, 1,0,1,0,1,0,1,0, 0,1,1,1,1,0,1,1, 0,0,1];
var size = Math.ceil(Math.sqrt(sol.length));
alert(sol.length);
alert(size);
var score = 0;
sol = fitSolToGrid(sol, size);

$(document).ready(function() {
    //Draw the grid
    $("#grid").html(clickableGrid(size,size, getColNames(sol,size), function(el,row,col,i) {
        console.log("You clicked on element:",el);
        console.log("You clicked on row:", row);
        console.log("You clicked on col:", col);
        console.log("State is", state);

        //Inside the grid
        if (row != 0 && col != 0) {
            //Colour the cell in the way you selected, remembering what it used to be in prevClass
            el.setAttribute("prevClass",el.className)
            el.className=state;

            //If this cell should be coloured in
            if (sol[row * size + col]) {
                //If you try to colour this cell in
                if (state=="colour") {
                    //If it wasn't already coloured
                    if (el.getAttribute("prevClass")!="colour") {
                        //Increase score
                        document.getElementById("score").innerHTML++;
                        //If you've coloured all the squares in, you've won!
                        if (parseInt(document.getElementById("score").innerHTML) == sol.reduce(function(sol, b) { return sol + b; }, 0))
                            alert("You win! Your score was " + document.getElementById("score").innerHTML);
                    }
                    //If you're trying to colour it in again
                }
                //If you try to clear this cell and you've already coloured it, lose a point
                else if (el.getAttribute("prevClass")=="colour"){
                    document.getElementById("score").innerHTML--;
                }
                //If you're trying to clear an empty or a clear cell
            }

            //If this cell shouldn't be coloured in
            else {
                //If you try to colour this cell in
                if (state=="colour") {
                    //Turn it red
                    el.className="wrong";
                    //If you got it wrong for the first time, lose a life
                    if (el.getAttribute("prevClass")!="wrong") {
                        document.getElementById("lives").innerHTML--;
                        //If you have no more lives, you've lost!
                        if (!parseInt(document.getElementById("lives").innerHTML))
                            alert("Game over! Your score was " + document.getElementById("score").innerHTML);
                    } else {
                        //If you got it wrong again
                    }

                }
                //If you try to clear this cell
                else {
                    //You've correctly tried to clear
                }
            }
        }
    }));

    //Change the state when you click a button
    $("#colourButton").click(function(){state="colour"});
    $("#clearButton").click(function(){state="clear";});
});

/////////////////////////////////////////FUNCTIONS/////////////////////////////////////////////

//Takes an array and converts it so that it fits within the grid
function fitSolToGrid(sol, size) {
    var i, fittedSol;
    fittedSol = sol;

    //Add spaces for the first square of each row, where the headers are
    for (i = 1; i < size; i++)
        fittedSol.splice(size * i - 1, 0, 0);

    //Add size number of pixels for the top row, and one more for the header of the second row.
    for (i = 0; i < size+1; i++)
        fittedSol.unshift(0);

    return sol;
}


function clickableGrid(rows, cols, names, callback) {
    var row = 0;
    var col = 0;
    var colnames = names;
    //Declaring the table with a classname grid
    var grid = document.createElement('table');
    grid.className = 'grid';
    //Drawing table
    for (row = 0; row < rows; ++row) {
        var tr = grid.appendChild(document.createElement('tr'));
        for (col = 0; col < cols; ++col) {
            var cell = tr.appendChild(document.createElement('td'));
            //Set unclickable cells
            //Clear top corner
            if (!row && !col);
            //Set headings
            else if (!row)
                cell.innerHTML = colnames[col - 1];
            else if (!col)
                cell.innerHTML = colnames[cols - 1 + row - 1];

            //Set clickable cells
            else {
                //Make things happen on click
                cell.addEventListener('click',(function(el,row,col){
                    return function(){
                        callback(el,row,col);
                    }
                })(cell,row,col),false);
                //Label incorrect cells with a !
                if (!sol[row * rows + col])
                    cell.innerHTML = "!";
            }
        }
    }
    return grid;
}

function addScore() {
    var para = document.createElement("p");
    var node = document.createTextNode(score);
    para.appendChild(node);
    var element = document.getElementById("button");
    element.appendChild(para);
}

function getColNames(sol, size) {
    var i, o, sum = 0, names = [];

    //get column headers
    for (o = 1; o < size; o++) {
        sum = 0;
        for (i = 1; i < size; i++)
            sum += sol[size * i + o];
        names.push(sum);
    }

    //get row headers
    for (o = 1; o < size; o++) {
        sum = 0;
        for (i = 1; i < size; i++)
            sum += sol[size * o + i];
        names.push(sum);
    }

    return names;
}