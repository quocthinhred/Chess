
let isWhiteTurn = true;

let chesses = document.getElementsByClassName("chess");
chesses = document.getElementsByClassName("chess");
for (const chess of chesses) {
    dragAndDrop(chess);
}

function dragAndDrop(obj) {
    obj.onmousedown = (e) => {
        this.oldX = obj.offsetLeft;
        this.oldY = obj.offsetTop;
        this.newX = this.oldX;
        this.newY = this.oldY;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.isMousedown = 1;
        let oldRow = Math.floor(this.oldY / 80);
        let oldCol = Math.floor(this.oldX / 80) + 1;
        let oldPos = 8 * oldRow + oldCol;
        let list_block = block_moveable(oldPos);
        for (let block_id of list_block){
            let block = document.getElementById(block_id.toString());
            block.style.border = "solid red 2px";
        }
    }

    obj.onmouseup = (e) => {
        for (let i = 1; i < 65; i++){
            let block = document.getElementById(i.toString());
            block.style.border = "none";
        }
        this.isMousedown = 0;
        let oldRow = Math.floor(this.oldY / 80);
        let oldCol = Math.floor(this.oldX / 80) + 1;
        let oldPos = 8 * oldRow + oldCol;
        let fromHere = document.getElementById(oldPos.toString());
        let newRow = Math.floor((this.newY + 40) / 80);
        let newCol = Math.floor((this.newX + 40) / 80) + 1;
        let newPos = 8 * newRow + newCol;
        let toHere = document.getElementById(oldPos.toString());
        if (moveable(obj, oldPos, newPos)) {
            toHere = document.getElementById(newPos.toString());
        }
        if (this.newX < -40 || this.newY < -40 || this.newY > 625 || this.newX > 620) {
            toHere = document.getElementById(oldPos.toString());
        }
        if (isChess(newPos)){
            if (isEnemy(oldPos, newPos)){
                
            }
            else {
                toHere = document.getElementById(oldPos.toString());
            }
        }
        if (isWhiteTurn){
            if (obj.classList.contains("black_team")){
                toHere = document.getElementById(oldPos.toString());
                alert("White Turn!");
            }
        }
        else {
            if (obj.classList.contains("white_team")){
                toHere = document.getElementById(oldPos.toString());
                alert("Black Turn!");
            }
        }
        obj.style.transform = "none";
        var temp = fromHere.innerHTML;
        fromHere.innerHTML = "";
        toHere.innerHTML = temp;
        if (toHere != fromHere){
            if (isWhiteTurn){
                isWhiteTurn = false;
            }
            else {
                isWhiteTurn = true;
            }
        }
        chesses = document.getElementsByClassName("chess");
        for (const chess of chesses) {
            dragAndDrop(chess);
        }
    }

    obj.onmousemove = (e) => {

        if (this.isMousedown === 1) {
            dX = e.clientX - this.mouseX;
            dY = e.clientY - this.mouseY;
            obj.style.transform = "translate(" + dX + "px, " + dY + "px)";
            this.newX = this.oldX + dX;
            this.newY = this.oldY + dY;
            chesses = document.getElementsByClassName("chess");
            this.onmousedown = (e) => {
                e.preventDefault();
            }
            for (const chess of chesses) {
                if (chess != obj) {
                    chess.onmousemove = (e) => {
                        e.preventDefault();
                    }
                }
            }
            document.onmousemove = obj.onmousemove;
        }

    }
}

function moveable(obj, old_block_id, new_block_id) {
    let new_Row = Math.floor(new_block_id / 8);
    let old_Row = Math.floor(old_block_id / 8);

    let new_Col = new_block_id % 8;
    let old_Col = old_block_id % 8;
    if (old_block_id % 8 === 0){
        old_Row = old_Row - 1;
        old_Col = 8;
    }
    if (new_block_id % 8 === 0){
        new_Row = new_Row - 1;
        new_Col = 8;
    }

    if (obj.classList.contains("rock")) {
        if (old_Row === new_Row) {
            if (isBarrierStraight(old_block_id, new_block_id)) {
                return false;
            }
            return true;
        }
        else if (old_Col === new_Col) {
            if (isBarrierStraight(old_block_id, new_block_id)) {
                return false;
            }
            return true;
        }
    }
    else if (obj.classList.contains("knight")) {
        if ((Math.abs(new_Row - old_Row) === 1 && Math.abs(new_Col - old_Col) === 2) || (Math.abs(new_Row - old_Row) === 2 && Math.abs(new_Col - old_Col) === 1)){
            return true;
        }
    }
    else if (obj.classList.contains("bishop")) {
        if (Math.abs(new_Row - old_Row) === Math.abs(new_Col - old_Col)) {
            if (isBarrierCross(old_block_id, new_block_id)){
                return false;
            }
            return true;
        }

    }
    else if (obj.classList.contains("queen")) {
        if (old_Row === new_Row) {
            if (isBarrierStraight(old_block_id, new_block_id)) {
                return false;
            }
            return true;
        }
        else if (old_Col === new_Col) {
            if (isBarrierStraight(old_block_id, new_block_id)) {
                return false;
            }
            return true;
        }
        if (Math.abs(new_Row - old_Row) === Math.abs(new_Col - old_Col)) {
            if (isBarrierCross(old_block_id, new_block_id)){
                return false;
            }
            return true;
        }
    }
    else if (obj.classList.contains("king")) {
        if (new_block_id === old_block_id + 1 || new_block_id === old_block_id + 7 || new_block_id === old_block_id + 8 || new_block_id === old_block_id + 9 || new_block_id === old_block_id - 1 || new_block_id === old_block_id - 7 || new_block_id === old_block_id - 8 || new_block_id === old_block_id - 9){
            return true;
        }
    }
    else if (obj.classList.contains("pawn")) {
        if (obj.classList.contains("black_team")){
            if (new_block_id === old_block_id + 7 || new_block_id === old_block_id + 9){
                if (isChess(new_block_id) && isEnemy(old_block_id, new_block_id)){
                    return true;
                }
            }
            else if (isChess(new_block_id)){
                return false;
            }
            if (old_Row === 1){
                if (new_block_id === old_block_id + 8 || new_block_id === old_block_id + 16){
                    if (isBarrierStraight(old_block_id, new_block_id)) {
                        return false;
                    }
                    return true;
                }
            }
            else {
                if (new_block_id === old_block_id + 8){
                    return true;
                }
            }
        }
        else if (obj.classList.contains("white_team")){
            if (new_block_id === old_block_id - 7 || new_block_id === old_block_id - 9){
                if (isChess(new_block_id)){
                    if (isEnemy(old_block_id, new_block_id)){
                        return true;
                    }
                } 
            }
            else if (isChess(new_block_id)){
                return false;
            }
            if (old_Row === 6){
                if (new_block_id === old_block_id - 8 || new_block_id === old_block_id - 16){
                    if (isBarrierStraight(old_block_id, new_block_id)) {
                        return false;
                    }
                    return true;
                }
            }
            else {
                if (new_block_id === old_block_id - 8){
                    return true;
                }
            }
        }
    }
    return false;
}

function isChess(block_id){
    let block = document.getElementById(block_id.toString())
    if (block.innerHTML == ""){
        return false;
    }
    else
    {
        return true; 
    }
}

function isEnemy(old_block_id, new_block_id){
    let old_block;
    let new_block;
    if (old_block_id < 10){
        old_block = document.querySelector("#\\3" + old_block_id.toString() + " > div");
    }
    else{
        old_block = document.querySelector("#\\3" + Math.floor(old_block_id / 10).toString() + " " + old_block_id % 10 + " > div");
    }
    if (new_block_id < 10){
        new_block = document.querySelector("#\\3" + new_block_id.toString() + " > div");
    }
    else{
        new_block = document.querySelector("#\\3" + Math.floor(new_block_id / 10).toString() + " " + new_block_id % 10 + " > div");
    }
    if ((old_block.classList.contains("black_team") && new_block.classList.contains("white_team")) || (old_block.classList.contains("white_team") && new_block.classList.contains("black_team"))){
        return true;
    }
    return false;
}

function isBarrierStraight(old_block_id, new_block_id){
    let new_Row = Math.floor(new_block_id / 8);
    let old_Row = Math.floor(old_block_id / 8);
    if (old_block_id % 8 === 0){
        old_Row = old_Row - 1;
    }
    if (new_block_id % 8 === 0){
        new_Row = new_Row - 1;
    }

    if (new_block_id - old_block_id === 1 || new_block_id - old_block_id === 8){
        return false;
    }
    if (Math.abs(new_block_id - old_block_id) < 8){
        if (new_block_id > old_block_id){
            for (let i = old_block_id + 1; i < new_block_id; i++){
                let block = document.getElementById(i.toString());
                if (block.innerHTML != ""){
                    return true;
                }
            }
        }
        else {
            for (let i = new_block_id + 1; i < old_block_id; i++){
                let block = document.getElementById(i.toString());
                if (block.innerHTML != ""){
                    return true;
                }
            }
        }
    }
    else {
        if (new_block_id > old_block_id){
            for (let i = 1; i < (new_Row - old_Row); i++){
                let temp = old_block_id + 8*i;
                let block = document.getElementById(temp.toString());
                if (block.innerHTML != ""){
                    return true;
                }
            }
        }
        else {
            for (let i = 1; i < (old_Row - new_Row); i++){
                let temp = old_block_id - 8*i;
                let block = document.getElementById(temp.toString());
                if (block.innerHTML != ""){
                    return true;
                }
            }
        }
    }
    return false;
}

function isBarrierCross(old_block_id, new_block_id){
    let new_Row = Math.floor(new_block_id / 8);
    let old_Row = Math.floor(old_block_id / 8);

    let new_Col = new_block_id % 8;
    let old_Col = old_block_id % 8;
    if (old_block_id % 8 === 0){
        old_Row = old_Row - 1;
        old_Col = 8;
    }
    if (new_block_id % 8 === 0){
        new_Row = new_Row - 1;
        new_Col = 8;
    }

    if (Math.abs(new_Row - old_Row) === 1){
        return false;
    }
    if (new_Row < old_Row && new_Col < old_Col){
        for (let i = 1; i < (old_Row - new_Row); i++){
            let cur_Pos = new_block_id + 8*i + i;
            let block = document.getElementById(cur_Pos.toString());
            if (block.innerHTML != ""){
                return true;
            }
        }
    }
    else if (new_Row < old_Row && new_Col > old_Col){
        for (let i = 1; i < (old_Row - new_Row); i++){
            let cur_Pos = new_block_id + 8*i - i;
            let block = document.getElementById(cur_Pos.toString());
            if (block.innerHTML != ""){
                return true;
            }
        }
    }
    else if (new_Row > old_Row && new_Col < old_Col){
        for (let i = 1; i < (new_Row - old_Row); i++){
            let cur_Pos = old_block_id + 8*i - i;
            let block = document.getElementById(cur_Pos.toString());
            if (block.innerHTML != ""){
                return true;
            }
        }
    }
    else{
        for (let i = 1; i < (new_Row - old_Row); i++){
            let cur_Pos = old_block_id + 8*i + i;
            let block = document.getElementById(cur_Pos.toString());
            if (block.innerHTML != ""){
                return true;
            }
        }
    }
    return false;

}

function block_moveable(block_id) {
    let list_block = new Array();
    for (let i = 1; i < 65; i++){
        let block;
        if (block_id < 10){
            block = document.querySelector("#\\3" + block_id.toString() + " > div");
        }
        else{
            block = document.querySelector("#\\3" + Math.floor(block_id / 10).toString() + " " + block_id % 10 + " > div");
        }
        if (moveable(block, block_id, i)){
            if (!isChess(i) || (isChess(i) && isEnemy(block_id, i))){
                list_block.push(i);
            }
        }
    }
    return list_block;
}
