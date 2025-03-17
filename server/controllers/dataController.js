const asyncHandler = require("express-async-handler");
const Make = require("../models/Make");
const bodyTypes = require("../data/bodyTypes.json");
const fuelTypes = require("../data/fuelTypes.json");

const Country = require("../models/Country");
const { response } = require("express");

const getCarSpecsData = asyncHandler(async (req, res) => {
  try {
    const makes = await Make.find().lean().exec();

    if (!makes) return res.status(500).send("failed to load makes data.");

    const data = {
      makes: makes,
      bodyTypes: bodyTypes.types,
      fuelTypes: fuelTypes.types,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500);
  }
});

const getCountries = asyncHandler(async (req, res) => {
  try {
    const countriesData = await Country.find().lean();

    return res.status(200).send(countriesData);
  } catch (error) {
    return res.status(500).send("Error fetching countries data.");
  }
});

module.exports = {
  getCarSpecsData,
  getCountries,
};
