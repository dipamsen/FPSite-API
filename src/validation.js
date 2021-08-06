const joi = require("joi");

/** @type {joi.ObjectSchema<import("./idnex").CalendarEvent>} */
const CalendarEventSchema = joi
  .object({
    date: joi.date(),
    description: joi.string().required(),
    startDate: joi.date(),
    endDate: joi.date(),
    name: joi.string().required(),
    type: joi.string().valid("holiday", "vacation", "test").required(),
  })
  .xor("date", "startDate")
  .with("startDate", "endDate");

module.exports = { CalendarEventSchema };
