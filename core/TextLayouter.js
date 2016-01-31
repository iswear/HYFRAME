/**
 * Created by Administrator on 2015/9/29.
 */
HY.Core.TextLayouter = function(config){
    this.init(config);
}
HY.Core.TextLayouter.prototype = new HY.Object();
HY.Core.TextLayouter.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    this._measureCanvas = document.createElement("canvas");
    this._measureContext = this._measureCanvas.getContext("2d");
    this._charWidthDics = {};
}
HY.Core.TextLayouter.prototype.getCharWidthDic = function(font){
    if(this._charWidthDics[font]){
        return this._charWidthDics[font];
    }else{
        var charswidth = {};
        charswidth[" "] = this._measureContext.measureText(" ").width;
        charswidth["!"] = this._measureContext.measureText("!").width;
        charswidth["\""] = this._measureContext.measureText("\"").width;
        charswidth["#"] = this._measureContext.measureText("#").width;
        charswidth["$"] = this._measureContext.measureText("$").width;
        charswidth["%"] = this._measureContext.measureText("%").width;
        charswidth["&"] = this._measureContext.measureText("&").width;
        charswidth["'"] = this._measureContext.measureText("'").width;
        charswidth["("] = this._measureContext.measureText("(").width;
        charswidth[")"] = this._measureContext.measureText(")").width;
        charswidth["*"] = this._measureContext.measureText("*").width;
        charswidth["+"] = this._measureContext.measureText("+").width;
        charswidth[","] = this._measureContext.measureText("-").width;
        charswidth["-"] = this._measureContext.measureText(",").width;
        charswidth["."] = this._measureContext.measureText(",").width;
        charswidth["/"] = this._measureContext.measureText("/").width;
        charswidth["0"] = this._measureContext.measureText("0").width;
        charswidth["1"] = this._measureContext.measureText("1").width;
        charswidth["2"] = this._measureContext.measureText("2").width;
        charswidth["3"] = this._measureContext.measureText("3").width;
        charswidth["4"] = this._measureContext.measureText("4").width;
        charswidth["5"] = this._measureContext.measureText("5").width;
        charswidth["6"] = this._measureContext.measureText("6").width;
        charswidth["7"] = this._measureContext.measureText("7").width;
        charswidth["8"] = this._measureContext.measureText("8").width;
        charswidth["9"] = this._measureContext.measureText("9").width;
        charswidth[":"] = this._measureContext.measureText(":").width;
        charswidth[";"] = this._measureContext.measureText(";").width;
        charswidth["<"] = this._measureContext.measureText("<").width;
        charswidth["="] = this._measureContext.measureText("=").width;
        charswidth[">"] = this._measureContext.measureText(">").width;
        charswidth["?"] = this._measureContext.measureText("?").width;
        charswidth["@"] = this._measureContext.measureText("@").width;
        charswidth["A"] = this._measureContext.measureText("A").width;
        charswidth["B"] = this._measureContext.measureText("B").width;
        charswidth["C"] = this._measureContext.measureText("C").width;
        charswidth["D"] = this._measureContext.measureText("D").width;
        charswidth["E"] = this._measureContext.measureText("E").width;
        charswidth["F"] = this._measureContext.measureText("F").width;
        charswidth["G"] = this._measureContext.measureText("G").width;
        charswidth["H"] = this._measureContext.measureText("H").width;
        charswidth["I"] = this._measureContext.measureText("I").width;
        charswidth["J"] = this._measureContext.measureText("J").width;
        charswidth["K"] = this._measureContext.measureText("K").width;
        charswidth["L"] = this._measureContext.measureText("L").width;
        charswidth["M"] = this._measureContext.measureText("M").width;
        charswidth["N"] = this._measureContext.measureText("N").width;
        charswidth["O"] = this._measureContext.measureText("O").width;
        charswidth["P"] = this._measureContext.measureText("P").width;
        charswidth["Q"] = this._measureContext.measureText("Q").width;
        charswidth["R"] = this._measureContext.measureText("R").width;
        charswidth["S"] = this._measureContext.measureText("S").width;
        charswidth["T"] = this._measureContext.measureText("T").width;
        charswidth["U"] = this._measureContext.measureText("U").width;
        charswidth["V"] = this._measureContext.measureText("V").width;
        charswidth["W"] = this._measureContext.measureText("W").width;
        charswidth["X"] = this._measureContext.measureText("X").width;
        charswidth["Y"] = this._measureContext.measureText("Y").width;
        charswidth["["] = this._measureContext.measureText("Z").width;
        charswidth["\\"] = this._measureContext.measureText("\\").width;
        charswidth["]"] = this._measureContext.measureText("]").width;
        charswidth["^"] = this._measureContext.measureText("^").width;
        charswidth["_"] = this._measureContext.measureText("_").width;
        charswidth["`"] = this._measureContext.measureText("`").width;
        charswidth["a"] = this._measureContext.measureText("a").width;
        charswidth["b"] = this._measureContext.measureText("b").width;
        charswidth["c"] = this._measureContext.measureText("c").width;
        charswidth["d"] = this._measureContext.measureText("d").width;
        charswidth["e"] = this._measureContext.measureText("e").width;
        charswidth["f"] = this._measureContext.measureText("f").width;
        charswidth["g"] = this._measureContext.measureText("g").width;
        charswidth["h"] = this._measureContext.measureText("h").width;
        charswidth["i"] = this._measureContext.measureText("i").width;
        charswidth["j"] = this._measureContext.measureText("j").width;
        charswidth["k"] = this._measureContext.measureText("k").width;
        charswidth["l"] = this._measureContext.measureText("l").width;
        charswidth["m"] = this._measureContext.measureText("m").width;
        charswidth["n"] = this._measureContext.measureText("n").width;
        charswidth["o"] = this._measureContext.measureText("o").width;
        charswidth["p"] = this._measureContext.measureText("p").width;
        charswidth["q"] = this._measureContext.measureText("q").width;
        charswidth["r"] = this._measureContext.measureText("r").width;
        charswidth["s"] = this._measureContext.measureText("s").width;
        charswidth["t"] = this._measureContext.measureText("t").width;
        charswidth["u"] = this._measureContext.measureText("u").width;
        charswidth["v"] = this._measureContext.measureText("v").width;
        charswidth["w"] = this._measureContext.measureText("w").width;
        charswidth["x"] = this._measureContext.measureText("x").width;
        charswidth["y"] = this._measureContext.measureText("y").width;
        charswidth["z"] = this._measureContext.measureText("z").width;
        charswidth["{"] = this._measureContext.measureText("{").width;
        charswidth["|"] = this._measureContext.measureText("|").width;
        charswidth["}"] = this._measureContext.measureText("}").width;
        charswidth["~"] = this._measureContext.measureText("~").width;
        charswidth["zh"] = this._measureContext.measureText("汉").width;
        this._charWidthDics[font] = charswidth;
        return charswidth;
    }
}
HY.Core.TextLayouter.prototype.getTextLayoutWidth = function(text,font){
    var charWidthDic = this.getCharWidthDic(font);
    var length = text.length;
    var textWidth = 0;
    var curChar = null;
    for(var i=0;i<length;++i){
        curChar = text[i];
        if(curChar > '~'){
            textWidth += charWidthDic["zh"];
        }else{
            textWidth += charWidthDic[text[i]];
        }
    }
    return textWidth;
}
HY.Core.TextLayouter.prototype.getTextLayoutArray = function(text,font,maxWidth){
    var charWidthDic = this.getCharWidthDic(font);
    var length = text.length, curLineWidth = 0, curCharWidth = 0, preCharIndex = 0;
    var curChar = null;
    var textArr = [];
    for(var i = 0; i < length ; ++i){
        curChar = text[i];
        if(curChar > '~'){
            curCharWidth = charWidthDic['zh'];
        }else{
            curCharWidth = charWidthDic[curChar];
        }
        curLineWidth += curCharWidth;
        if(curLineWidth > maxWidth){
            textArr.push(text.substring(preCharIndex,i));
            curLineWidth = curCharWidth;
            preCharIndex = i;
        }
    }
    if(preCharIndex < length){
        textArr.push(text.substring(preCharIndex,length));
    }
    return textArr;
}
HY.Core.TextLayouter.instance = new HY.Core.TextLayouter({});