const path = require('path');
const AthleteService = require('../../../services/athlete.service');
const FlagCheck = require('../../../utils/flagCheck');
const { json } = require('body-parser');
// const AthleteService = require('../../../services/athlete.service');

class AthleteController {
  Index(req, res) {
    console.log("running");
    res.render("admin/athlete/index", { layout: "layout/layoutAdmin" });
  }
  async ManageList(req, res){
    console.log("runn")
    const idEvent ="689d3e161d99d1e9a91f9682";
    try {
      const _athleteService = new AthleteService();
      var result = await _athleteService.AthleteList(idEvent);
      // FlagCheck(result.status, result.mess);
      // res.json(result.data)
      res.render('admin/athlete/managerAthlete', {layout:'layout/layoutAdmin', athletes: result.data}) 
    } catch (error) {
      console.log(error)
      res.json({status: false, data:[]})
    }
  }
  async UploadExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const filePath = path.resolve(req.file.path);
      const event_id = req.body.event_id || null;

      const _athleteService = new AthleteService();
      const result = await _athleteService.UploadExcelToDB(filePath, event_id);
      // FlagCheck(result.status, result.mess)
      res.json({staus:true, mess: result.data})

    } catch (error) {
      console.log(error);
      res.json({ status: false, mess: error.message });
    }
  }
  async AthleteDetail(req, res){
    try {
      const _eventId = req.body.event_id;
      const _athleteId = req.body.athlete_id;
  
      const _athleteService = new AthleteService();
      var result = await _athleteService.GetById(_eventId, _athleteId);
      // console.log(result)
      res.json({sucess: true, mess: "",data: result.data});
    } catch (error) {
      console.log(error)
      res.json({success: false, mess:error})
    }
  }
  async AthleteUpdate(req, res){
    try {
    //convert data
    let _event_id= req.body.event_id  // cần truyền từ form hoặc gắn sẵn
    let _athlete_id=  req.body.athlete_id;
    const athleteData = {

      bib: req.body.bib,
      name: req.body.name,
      bib_name: req.body.bib_name,

      gender: req.body.gender === "true", // convert string -> boolean
      email: req.body.email,
      phone: req.body.phone,

      dob: req.body.dob ? new Date(req.body.dob) : null, // convert string -> Date

      cccd: req.body.cccd,
      nation: req.body.nation,
      team: req.body.team,

      chip: req.body.chip,
      epc: req.body.epc,
      distance: req.body.distance,

      patron_name: req.body.patron_name,
      patron_phone: req.body.patron_phone,

      medical: req.body.medical,
      blood: req.body.blood,
      size: req.body.size,
    }
    //db
    var _athleteService = new AthleteService();
    var result = await _athleteService.UpdateById(_athlete_id, _event_id, athleteData)
    FlagCheck(result.status, result.mess);
    res.json({success: true, mess: '', data: []})
    } catch (error) {
      res.json({success: false, mess: error})
    }

  }
  async AthleteList(req, res){
    // console.log("running")
    var _event_id =req.params.slug;
    console.log(_event_id)
    try {
      const _athleteService = new AthleteService();
      var result = await _athleteService.AthleteList(_event_id);
      return json({success: true, data: result.data});
    } catch (error) {
      console.log(error);
      return json({success: false, mess: error})
    }
  }
  //delete by id 
  async AthleteDelete(req, res){
    // console.log("running")

    let _event_id = req.body.event_id;
    let _athlete_id =req.body.athlete_id;
    console.log(_event_id+" "+_athlete_id)
    //
    try {
      const _athleteService = new AthleteService();
      var result = await _athleteService.DeleteById(_athlete_id, _event_id);
      res.json({success: true, data:[]})
    } catch (error) {
      console.log(error)
      res.json({success: false, mess: error})
    }

  }
}

module.exports = new AthleteController();
