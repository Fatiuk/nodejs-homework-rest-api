const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");

router.get("/", ctrl.getContactsList);

router.get("/:contactId", ctrl.getContactById);

router.post("/", ctrl.addContact);

router.put("/:contactId", ctrl.updateContactById);

router.delete("/:contactId", ctrl.deleteContactById);

module.exports = router;
