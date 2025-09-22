const eventService = require("../../../services/event.service");
const CNAME = "EventProcessingController";
const VNAME = "admin/eventprocessing/";
const VLAYOUT = "layout/layoutAdmin";

class EventProcessingController {
  //index event list
  async Index(req, res) {
    try {
      const  query = await eventService.listEvent();
      const events =await  query.data;
      console.log(events)
      res.render("admin/eventprocessing/index", {
        layout: VLAYOUT,
        title: "Event Processing",
        events: events,
        status: {
          status: false,
          mess: "AAA",
        },
      });
    } catch (error) {
      console.log(CNAME + " Index " + error);
      res.status(500).render("admin/eventprocessing/index", {
        layout: "layout/layoutAdmin",
        title: "Event Processing",
        events: events,
        status: {
          status: false,
          mess: error,
        },
      });
    }
  };
  // form-create-event
  FormAdd(req, res){
    res.render(VNAME+"create",{
      layout: VLAYOUT,
      title: "Create",
    });
  }

  async testAction(req, res) {
    res.render("admin/eventprocessing/test", {
      layout: "layout/layoutAdmin",
      title: "Test Event Processing",
    });
  }
  async progressFlowAction(req, res) {
    const steps = [
      { id: 1, label: "Bước 1: Khởi tạo" },
      { id: 2, label: "Bước 2: Xử lý dữ liệu" },
      { id: 3, label: "Bước 3: Gửi thông báo" },
      { id: 4, label: "Bước 4: Hoàn tất" },
    ];
    const currentStatus = req.query.status ? parseInt(req.query.status) : 1; // Lấy status từ query param hoặc mặc định là 1

    res.render("admin/eventprocessing/progressFlow", {
      layout: "layout/layoutAdmin",
      title: "Progress Flow Test",
      steps: steps,
      currentStatus: currentStatus,
    });
  }
}

module.exports = new EventProcessingController();
