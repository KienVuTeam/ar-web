function FlagCheck(input, action){
    const label = (action ? ' | '+action : '').toString();
    if(input){
        console.log('🚩 Check: 🟢'+label)
    }else{
        console.log('🚩 check: 🔴'+label)
    }
}

module.exports = FlagCheck; //export kiểu plan text