const checkNumber = require('./func')
const {odd, even} = require('./var')

// var 참조
function checkStringOddOrEven(str) {
    if (str.length % 2) {
        return odd
    }
    return even
}

console.log(checkNumber(10))
console.log(checkStringOddOrEven('hello'))