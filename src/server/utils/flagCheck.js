function FlagCheck(input, mess){
    const label = (mess ? ' | '+action : '').toString();
    if(input){
        console.log('🚩 Check: 🟢'+label)
    }else{
        console.log('🚩 check: 🔴'+label)
    }
}

module.exports = FlagCheck; //export kiểu plan text