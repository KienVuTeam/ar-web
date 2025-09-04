// weird-js.js
// Các case "meme" ép kiểu của JavaScript/Node.js
// Có kèm kết quả + chú thích

console.log("=== String + Number ===");
console.log(1 + "1");        // "11" → số 1 bị ép thành string → "1" + "1"
console.log("1" + 1 + 1);    // "111" → từ trái sang phải: "1"+1="11", "11"+1="111"
console.log(1 + 1 + "1");    // "21"  → (1+1)=2, rồi 2+"1"="21"

console.log("\n=== String - Number (toán tử trừ ép string thành số) ===");
console.log("10" - 1);       // 9 → "10" được ép thành 10
console.log("10" * 2);       // 20 → "10" thành 10, 10*2=20
console.log("10" / 2);       // 5 → "10" thành 10, 10/2=5
console.log("abc" - 1);      // NaN → "abc" không convert được sang số

console.log("\n=== Boolean + Number ===");
console.log(true + true);    // 2 → true=1, 1+1=2
console.log(true + false);   // 1 → true=1, false=0
console.log(false + false);  // 0 → 0+0=0

console.log("\n=== Null và Undefined ===");
console.log(null + 1);       // 1 → null ép thành 0
console.log(undefined + 1);  // NaN → undefined không ép thành số
console.log(null == undefined);  // true → rule đặc biệt trong JS
console.log(null === undefined); // false → khác kiểu (object vs undefined)

console.log("\n=== So sánh == và === ===");
console.log(0 == false);     // true → ép kiểu: false=0 → 0==0
console.log(0 === false);    // false → khác kiểu (number vs boolean)
console.log("" == false);    // true → "" ép thành 0 → 0==0
console.log("" === false);   // false → khác kiểu
console.log([] == false);    // true → [] ép thành "" → ""==false → 0==0
// console.log([] === false);   // false → khác kiểu

console.log("\n=== Array + Object ===");
console.log([] + []);        // "" → [] toString() = "" → "" + "" = ""
console.log([] + {});        // "[object Object]" → []="" , {} toString()="[object Object]"
console.log({} + []);        // 0 😵 → {} bị parse thành block code rỗng, còn +[] = +"" = 0

console.log("\n=== Những case gây lú ===");
console.log([] == ![]);      // true → ![] = false → []==false → ""==false → 0==0
console.log("0" == false);   // true → "0" ép thành 0 → 0==0
console.log("0" === false);  // false → khác kiểu
console.log([1,2] + [3,4]);  // "1,23,4" → array toString(): "1,2" + "3,4"

console.log("\n=== NaN ===");
console.log(NaN == NaN);     // false → NaN không bao giờ bằng chính nó
console.log(isNaN(NaN));     // true → check bằng isNaN

console.log("\n=== Infinity ===");
console.log(1 / 0);          // Infinity → chia cho 0
console.log(-1 / 0);         // -Infinity → chia cho 0 âm
console.log(Infinity > 999999999999); // true → Infinity luôn lớn hơn mọi số

