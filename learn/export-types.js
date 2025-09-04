/**
 * export-types.js
 * 
 * Tổng hợp các loại export trong Node.js (CommonJS + ES Module).
 * 
 * 📌 Quy tắc: "cái gì gán được vào biến thì export được".
 * Nghĩa là bạn có thể export function, object, class, primitive, array, promise, ...
 * 
 * Lưu ý:
 * - CommonJS: dùng module.exports + require()
 * - ES Module: dùng export + import (cần "type": "module" trong package.json)
 */

// ===============================
// 🔹 1. Export Function
// ===============================

// CommonJS
function greet(name) {
  return `Hello, ${name}`;
}
module.exports.greet = greet;

// ES Module
// export function greet(name) {
//   return `Hello, ${name}`;
// }


// ===============================
// 🔹 2. Export Object
// ===============================
const config = {
  appName: "DemoApp",
  version: "1.0.0"
};
module.exports.config = config;

// ES Module
// export const config = { appName: "DemoApp", version: "1.0.0" };


// ===============================
// 🔹 3. Export Class
// ===============================
class User {
  constructor(name) {
    this.name = name;
  }
  hello() {
    return `Hi, I'm ${this.name}`;
  }
}
module.exports.User = User;

// ES Module
// export default class User { ... }


// ===============================
// 🔹 4. Export Primitive (number, string, boolean, null, undefined, symbol, bigint)
// ===============================
module.exports.PI = 3.14159;
module.exports.MESSAGE = "Hello world";
module.exports.IS_PROD = false;
module.exports.NULL_VALUE = null;
module.exports.SYMBOL_ID = Symbol("id");
module.exports.BIG_NUMBER = 1234567890123456789012345678901234567890n;

// ES Module
// export const PI = 3.14159;
// export const MESSAGE = "Hello world";


// ===============================
// 🔹 5. Export Array
// ===============================
module.exports.fruits = ["apple", "banana", "orange"];

// ES Module
// export const fruits = ["apple", "banana", "orange"];


// ===============================
// 🔹 6. Export Promise / Async
// ===============================
module.exports.delayed = new Promise((resolve) => {
  setTimeout(() => resolve("done"), 1000);
});

// ES Module
// export const delayed = new Promise((resolve) => { ... });


// ===============================
// 🔹 7. Export nhiều loại cùng lúc
// ===============================
function sum(a, b) { return a + b; }
const VERSION = "2.0.0";
class Product {}

module.exports = {
  greet,
  config,
  User,
  PI: module.exports.PI,
  fruits: module.exports.fruits,
  sum,
  VERSION,
  Product
};

// ES Module
// export { greet, config, User, PI, fruits, sum, VERSION, Product };


// ===============================
// 📌 Sử dụng trong file khác (CommonJS)
// ===============================
// const { greet, User, PI, fruits, delayed } = require("./export-types");
// console.log(greet("Nam"));             // Hello, Nam
// console.log(new User("An").hello());   // Hi, I'm An
// console.log(PI);                       // 3.14159
// console.log(fruits);                   // [ 'apple', 'banana', 'orange' ]
// delayed.then(console.log);             // done

// 👌 chuẩn luôn! Bạn nắm được rồi thì sau này chỉ cần nhớ quy tắc:
// Một thứ duy nhất → module.exports = ...
// Nhiều thứ → module.exports = { ... } hoặc module.exports.tên = ...