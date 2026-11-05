const myName = ""
let ourName = ""
var hisName = ""

let myVar = 8
myVar++

let ourVar = 9
ourVar--

var remainder;
remainder = 11 % 3
// console.log(remainder)

var a = 11
a += 6

var b = 15
b += 3

var c = 20
c-= 6

var d = 13
d *= 10

var e = 17
e /= 2

var myString = "Hello I \"test\" this thing \"if it's\""
// console.log(myString)

var ourStr = "This is the first"
ourStr += " This is the second"

// console.log(ourStr)

var hisName = "John"
var herName = "Natalie " + hisName
hisNameLength = hisName.length
lastLetter = hisName[hisNameLength - 1]
// console.log(lastLetter)

function wordBlanks(noun, adjective, verb, adverb) {
    var result = ""
    result+= "My" + " "  + noun + " "  + adjective + " "  + "can " + verb + " " + adverb  

    return result;
}

// console.log(wordBlanks("dog", "big", "run", "very fast"))

var myArray = [[1,2,3],[4,5,6],[7,8,9]]
myArray.push(["Scotty", "Pimping", "Nigga"])
const data = myArray[3][2]
const remove = myArray.pop()
const first = myArray.shift()
 myArray.unshift(["Test"])
// console.log(myArray )

function myfunction () {
    console.log("Hello World")
}

// myfunction()

function functionWithArgs(a,b){
    console.log(a + b)
}

// functionWithArgs(10,5)

var outerWear = "T-Shirt"

function myOutfit() {
    var outerWear = "sweater";

    return outerWear;
}

// console.log(myOutfit())
// console.log(outerWear)

function minusSeven(num) {
    return num - 7
}
// console.log(minusSeven(10))

function testArr(arr, item){
    arr.push(item)
    return arr.shift()
}

// var list = [1,2,3,4,5];

// console.log("Before " + JSON.stringify(list))
// console.log(testArr(list, 6))
// console.log("After " + JSON.stringify(list))


function trueOrFalse(wasThatTrue){
if (wasThatTrue) {
    return "Yes that was true"
}
return "No that was false"
}
// console.log(trueOrFalse(true))

function testEqual(val){
    if( val == 12){
        return "Hey!"
    } 
    return "Fuck You!"
}

// console.log(testEqual(11))

function testStrict( val ) {
    if (val === 15){
        return console.log("It's the same!")
    }
    return console.log("IT'S NOT THE SAME!")
}

// testStrict(12)

function testStrictNotEqual (val){
    if(val !== 17){
        return "Not Equal"
    }
    return "Equal"
}

function testGreaterThan (val){
    if(val > 100){
        return "Over 100"
    }
    if(val > 10){
        return "Over 10"
    }
    if(val < 10) {
        return "Less than 10"
    }
}

// console.log(testGreaterThan(15))

function testGreaterThanOrEqual (val){
    if(val >= 20){
        return "20 or over"
    }
    if(val >= 10){
        return "10 or over"
    }
    if(val >= 5){
        return "5 or over"
    }
}
// console.log(testGreaterThanOrEqual(35))

function testLessThan(val){
    if(val < 30){
        return "Less than 30"
    }
    if(val < 20){
        return "Less than 20"
    }
    if(val < 10){
        return "Less than 10"
    }
}
// console.log(testLessThan(25))

function testLessThanOrEqual(val) {
    if(val <= 30){
        return "30 or less than"
    }
    if(val <= 20){
        return "20 or less than"
    }
    if(val <= 10){
        return "10 or less than"
    }
}
// console.log(testLessThanOrEqual(15))

function testLogicalAnd(val) {
    if(val <= 50 && val >= 25) {
        return "Yes"
    }

    return "No"
}

// console.log(testLogicalAnd(20))

function testLogicalOr(val) {
    if (val < 10 || val > 20) {
        return "Outside"
    }
    return "Inside"
}
// console.log(testLogicalOr)

function testElse(val){
    if (val > 5) {
        return "More than 5"
    }
    else {
        return "Less than 5"
    }

}
// console.log(testElse(7))

function testElseIf(val) {
    if(val > 15){
        return  "More than 15"
    } else if(val > 10){ 
        return "More than 10"
    } else {
        return "Less than 10"
    }
}

// console.log(testElseIf(12))

function testSize (num) {
    if (num < 5) {
        return "Tiny"
    } else if(num < 10) {
        return "Small"
    } else if(num < 15) {
        return "Medium"
    } else if(num < 20) {
        return "Large"
    } else {
        return "Huge"
    }
    
}

// console.log(testSize(21))

var names = ["Hole-in-one!", "Eagle", "Birdie", "Par", "Bogey", "Double Bogey", "Go home" ]
function golfScore(par, strokes){
    if (strokes === 1 ){
        return names[0]
    } else if (strokes <= par - 2) {
        return names[1]
    } else if (strokes === par - 1){
        return names[2]
    } else if (strokes === par) {
        return names[3]
    } else if ( strokes === par + 1) {
        return names[4]
    } else if ( strokes === par + 2){
        return names[5]
    }
     else if ( strokes >= par + 3){
        return names[6]
    }
}

console.log(golfScore(5, 12))