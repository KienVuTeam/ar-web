// process.argv là 1 mảng chứa các tham số
// [0] = đường dẫn node
// [1] = đường dẫn file
// [2] = tham số bạn truyền (vd: true/false)
// const arg = process.argv[2];
//conver boolean
// const status = arg === "true";
// const myPromise = new Promise((resolve, reject)=>{
//     //gia xu viec download 1 file mat 2s
//     //status cua cong viec dang lam: 
//     setTimeout(() => {
//         // const success = status;
//         if(status){
//             resolve('✅ tai du lieu thanh cong')
//         }else{
//             reject('❌ tai du lieu that bai')
//         }
//     }, 2000);
// })

// myPromise
// .then(result=>{
//     console.log("ket qua: ",result);
// })
// .catch(err=>{
//     console.log("loi here: "+err)
// })
// .finally(()=>{
//     console.log("Hoanm thanh")
// })
const argv = process.argv[2];
// const mess = arg;
 function printOut(mess){
    console.log("--------------Thong diep ban da chuyen vao--------")
    console.log(mess)
}

printOut(argv)
