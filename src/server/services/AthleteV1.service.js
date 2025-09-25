
const athleteService = require('./athlete.service');

class AthleteV1 extends athleteService{
    #mess; //provate field
    constructor(name, mess){
        super()// goi constructor cua class cha
        this.#mess = mess //private
        this.name = name //public
    }
    get mess(){
        return this.#mess;
    }
    set mess(val){
        this.#mess = val;
    }

}

module.exports = AthleteV1;