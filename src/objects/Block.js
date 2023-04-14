class Block {
    constructor (id, pos) {
        this.type = "Block"
        this.id = id; // str
        this.base = new ScreenElement(pos.copy(), new v2(0, 0)); 
        this.sprite = null;
        this.cont = null;
        
        if (BLOCKS[id].div == "A") {
            this.sprite = "blockA_icon";
            this.cont = [
                [new Container(pos.shifted(new v2(7, 16)), new v2(10, 10), "Phoneme"), 
                new v2(7, 16),],
                
                [new Container(pos.shifted(new v2(33, 16)), new v2(10, 10), "Phoneme"), 
                new v2(33, 16)],
                
                [new Container(pos.shifted(new v2(0, 29)), new v2(50, 30), "Block"), 
                new v2(0, 29)],
            ]
            this.base.size = new v2(50, 30);
        }
        else if (BLOCKS[id].div == "B") {
            this.sprite = "blockB_icon";
            this.cont = [
                [new Container(pos.shifted(new v2(20, 16)), new v2(10, 10), "Phoneme"), 
                new v2(20, 16),],
                
                [new Container(pos.shifted(new v2(0, 29)), new v2(50, 30), "Block"), 
                new v2(0, 29)],
            ]
            this.base.size = new v2(50, 30);
        }
    }
    draw () {
        this.base.draw()
        
        if (this.cont !== null) {
            for (let k of this.cont) {
                k[0].pos = this.pos.shifted(k[1])
                if (k[0].content !== null) {k[0].content.base.isSubDragging = this.base.isSubDragging};
                k[0].draw();

            }
        }   
        for (let container of this.cont) {
            container[0].disabled = this.base.isSubDragging;
        }
    }
    render() {
        this.base.render()
        // bottom sprite, icon
        image(IMG[this.sprite], this.pos.x, this.pos.y, this.base.size.x, this.base.size.y);
        // symbol on the right
        image(IMG[BLOCKS[this.id].symbol], this.pos.x + 40, this.pos.y + 4, 6, 6);
        if (false) {
            //name
            textAlign(LEFT, CENTER); textSize(this.base.size.y/6); textFont(FONT["MPLUS_Bold"]); fill(color(COLORS["black"]));
            text(BLOCKS[this.id].abv, this.pos.x + this.base.size.x/16, this.pos.y + this.base.size.y/6 );
            // condition of block
            textAlign(LEFT, CENTER); textSize(this.base.size.y/6); textFont(FONT["MPLUS_Bold"]); fill(color(COLORS["black"]));
            text(BLOCKS[this.id].cond, this.pos.x + this.base.size.x/16, this.pos.y + 6 * this.base.size.y/16 );
        } else {
            // name of block
            textAlign(LEFT, CENTER); textSize(this.base.size.y/4); textFont(FONT["MPLUS_Bold"]); fill(color(COLORS["black"]));
            text(BLOCKS[this.id].abv, this.pos.x + this.base.size.x/16, this.pos.y + this.base.size.y/6 );
            // condition of block
            textAlign(LEFT, CENTER); textSize(this.base.size.y/8); textFont(FONT["MPLUS"]); fill(color(COLORS["black"]));
            text(BLOCKS[this.id].cond, this.pos.x + this.base.size.x/16, this.pos.y + 6 * this.base.size.y/16 );
        }

        if (this.cont !== null) {
            for (let k of this.cont) {
                k[0].render()
            }
        }
    }
    get pos() {
        return this.base.pos.copy();
    }
    set pos(in_v2) {
        this.base.pos = in_v2.copy();
    }
    get isDragging() {
        return this.base.isDragging;
    }
    get isSubDragging() {
        return this.base.isSubDragging;
    }
    get isContained() {
        return this.base.isContained;
    }
    set isContained(in_bool) {
        this.base.isContained = in_bool;
    }
}





function getBlockChain(inBlock) {
    
    let chain = null;
    if (inBlock == null) {return []}
    
    if (inBlock.cont == null) { return [inBlock];
    } else {
        let f = false
        for (container of inBlock.cont) {
            if (container[0].content_type == "Block") {
                if (!container[0].isEmpty()) {
                    if (container[0].isEmpty()) {return [inBlock]}
                    f = true
                    chain = container[0].content;
                    break;
                }
            }
        } 
        if (f) {return [inBlock].concat(getBlockChain(chain))}
        else {return [inBlock]}
    }
};

const BLOCKS = {
    "Lenition" : {
        "name": "Lenition", "abv": "LEN", "div": "A",
        "symbol": "symbol_len", "cond": "",
    },
    "Lenition" : {
        "name": "Lenition", "abv": "LEN", "div": "A",
        "symbol": "symbol_len", "cond": "",
    },
    "Vocalization" : {
        "name": "Lenition", "abv": "LEN", "div": "A",
        "symbol": "symbol_len", "cond": "",
    },
    "Deletion" : {
        "name": "Deletion", "abv": "DEL", "div": "B",
        "symbol": "symbol_del", "cond": "",
    },
    "Deletion_ConsEndOfWord" : {
        "name": "Deletion", "abv": "DEL", "div": "B",
        "symbol": "symbol_del", "cond": "[C]#→[]#",
    },
    "Deletion_SchwaEndOfWord" : {
        "name": "Deletion", "abv": "DEL", "div": "B",
        "symbol": "symbol_del", "cond": "[ə]#→[]#",
    },
    "Insertion" : {
        "name": "Insertion", "abv": "INS", "div": "B",
        "symbol": "symbol_ins", "cond": "",
    },
    "Insertion_VowelEpenthesis" : {
        "name": "Insertion", "abv": "INS", "div": "B",
        "symbol": "symbol_ins", "cond": "[]CC→[V]CC",
    },
    "Debuccalization" : {
        "name": "Debuccalization", "abv": "DEBC", "div": "B",
        "symbol": "symbol_debc", "cond": "",
    },
    "Debuccalization_Conditionless" : {
        "name": "Debuccalization", "abv": "DEBC", "div": "B",
        "symbol": "symbol_debc", "cond": "[F]→[h]",
    },
}