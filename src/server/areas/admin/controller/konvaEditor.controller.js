const CertificateConfig = require('../../../model/CertificateConfig');
const Event = require('../../../model/Event');

exports.getKonvaEditor = async (req, res) => {
    try {
        const eventId = req.query.ei; // Assuming event ID is passed as a query parameter
        let cc = null; // CertificateConfig

        if (eventId) {
            cc = await CertificateConfig.findOne({ event_id: eventId });
        }

        // Render the new Konva editor EJS file
        res.render('admin/volunteer/konva-editor', {
            layout: 'layout/layoutAdmin', // Assuming you have an admin layout
            cc: cc,
            ei: eventId
        });
    } catch (error) {
        console.error("Error loading Konva editor:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.saveKonvaConfig = async (req, res) => {
    try {
        const { ei, config } = req.body;

        if (!ei || !config) {
            return res.status(400).json({ success: false, message: "Missing event ID or config data." });
        }

        let certificateConfig = await CertificateConfig.findOne({ event_id: ei });

        if (certificateConfig) {
            certificateConfig.fields = config;
            await certificateConfig.save();
        } else {
            certificateConfig = new CertificateConfig({
                event_id: ei,
                fields: config
            });
            await certificateConfig.save();
        }

        res.json({ success: true, message: "Konva config saved successfully." });
    } catch (error) {
        console.error("Error saving Konva config:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};