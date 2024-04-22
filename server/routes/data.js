const dataController = require("../controllers/dataController");

const express = require("express");
const router = express.Router();

router.route("/CarSpecs").get(dataController.getCarSpecsData);

module.exports = router;
