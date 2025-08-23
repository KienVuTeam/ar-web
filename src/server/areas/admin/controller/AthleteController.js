const path = require('path');
const AthleteService = require('../../../services/athlete.service');
const FlagCheck = require('../../../utils/flagCheck');

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
      console.log(result)
      res.json({sucess: true, mess: "",data: result.data});
    } catch (error) {
      console.log(error)
      res.json({mess:"server"})
    }
  }
}

module.exports = new AthleteController();
