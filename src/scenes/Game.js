let test_phonA = new Phoneme("a", new v2(10, 10))
let test_phonB = new Phoneme("b", new v2(30, 30))
let test_phonC = new Phoneme("c", new v2(50, 30))
let test_blockA = new Block("Lenition", new v2(70, 70))
let test_blockB = new Block("Debuccalization_Conditionless", new v2(100, 30))
let test_blockC = new Block("Deletion_ConsEndOfWord", new v2(100, 70))
let test_blockD = new Block("Insertion_VowelEpenthesis", new v2(100, 100))

//let test_cont = new Container( new v2(50, 50),  new v2(10, 10), "Phoneme")
let isMouseHolding = false;
let mouseHolding = null;
let isMouseHovering = false;
let mouseHovering = null;

let screenObjects = {
    "Block": [],
    "Phoneme" : [],
}

class sceneGame {
    init () {
        screenObjects["Phoneme"].push(test_phonA);
        screenObjects["Phoneme"].push(test_phonB);
        screenObjects["Phoneme"].push(test_phonC);

        screenObjects["Block"].push(test_blockA);
        screenObjects["Block"].push(test_blockB);
        screenObjects["Block"].push(test_blockC);
        screenObjects["Block"].push(test_blockD);
    }
    draw () {
        noSmooth()
        isMouseHovering = false;
        mouseHovering = null;
        // pre-check if the mouse is holding on to anything
        isMouseHolding = false;
        mouseHolding = null;
        for (let key in screenObjects) {
            for (let obj of screenObjects[key]) {
                obj.base.disabled = false
                if (obj.isDragging) {
                    isMouseHolding = true;
                    mouseHolding = obj;
                }
                obj.base.isSubDragging = false;
            };
        }
        
        // move mouseHolding item to the top
        if (mouseHolding != null) {
            if (mouseHolding.type == "Phoneme") {
                let key = mouseHolding.type;
                let f = false;
                for (let i = 0; i < screenObjects[key].length; i++) {
                    if (screenObjects[key][i] === mouseHolding) {
                        screenObjects[key].splice(i, 1)
                        f = true
                    }
                }
                if (f) {screenObjects[key].push(mouseHolding);}
            }
            else if (mouseHolding.type == "Block") {
                let mouseHoldingChain = getBlockChain(mouseHolding);
                let i = 0;
                let last_position = mouseHoldingChain[0].pos.copy();
                for (let obj of mouseHoldingChain) {
                    
                    // forcing position
                    i += 1;
                    if (i != 0) {obj.pos = last_position.copy()};
                    last_position = last_position.shifted(new v2(0, 29))

                    if (obj.cont !== null) {
                        for (container in obj.cont) {
                            if (container.content_type == "Block") {
                                container.pos = last_position.copy();
                            }
                        }
                    }

                    let f = false;
                    obj.base.isSubDragging = true;
                    for (let i = 0; i < screenObjects[mouseHolding.type].length; i++) {
                        if (screenObjects[mouseHolding.type][i] == obj) {
                            
                            screenObjects[mouseHolding.type].splice(i, 1)
                            f = true
                        }
                    }
                    if (f) {screenObjects[mouseHolding.type].push(obj); }
                }
            }
            
        }
        // in reverse order, draw (tell them to function)
        const keys = Object.keys(screenObjects);
        for (let i = keys.length - 1; i >= 0; i--) {
            for (let j = screenObjects[keys[i]].length -1; j >= 0; j--) {
                screenObjects[keys[i]][j].draw()
            };
        };
        // render, show them to screen
        for (let key in screenObjects) {
            for (let obj of screenObjects[key]) {
                if (obj.isSubDragging) {continue}; // will render subDragged blocks in the next code block
                obj.render();
            };
        };
        // render the mouseholding stuff on top of everything else
        if (mouseHolding != null) {
            if (mouseHolding.type == "Block") {
                let mouseHoldingChain = getBlockChain(mouseHolding);
                for (let obj of mouseHoldingChain) {
                    obj.render()
                    for (let subcont of obj.cont) {
                        if (subcont[0].isEmpty()) {continue;}
                        if (subcont[0].content.type == "Block") {continue;}
                        
                        subcont[0].content.render()
                    }
                }
            }
        } 
        

        

        fill(color(COLORS.white));
        ellipse(mouse_pos.x, mouse_pos.y, 10 / SCALE)
    }

    
}

const PHONEMES = {
    "": {
        "id":"",
        "place": ["", ""],
        "manner":["", ""],
        "voice": true,
        "":"",
    },
    "p": {
        "id" : "p",
        "place":["labial", ""],
        "manner":["consonant", "plosive"],
        "voice": false,
    },
    "t": {
        "id":"t",
        "place": ["coronal",""],
        "manner":["consonant", "plosive"],
        "voice": false,
    },
    "c": {
        "id":"c",
        "place": ["palatal", ""],
        "manner":["consonant", "plosive"],
        "voice": false,
    },
    "k": {
        "id":"k",
        "place": ["velar", ""],
        "manner":["consonant", "plosive"],
        "voice": false,
    },
    "b": {
        "id" : "b",
        "place":["labial", ""],
        "manner":["consonant", "plosive"],
        "voice": true,
    },
    "d": {
        "id":"d",
        "place": ["coronal",""],
        "manner":["consonant", "plosive"],
        "voice": true,
    },
    "ɟ": {
        "id":"ɟ",
        "place": ["palatal", ""],
        "manner":["consonant", "plosive"],
        "voice": true,
    },
    "g": {
        "id":"g",
        "place": ["velar", ""],
        "manner":["consonant", "plosive"],
        "voice": true,
    },

}