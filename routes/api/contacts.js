const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const { addSchema, updateFavoriteSchema } = require("../../schemas");

router.get("/", ctrl.getContactsList);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(addSchema), ctrl.addContact);

router.put("/:contactId", validateBody(addSchema), ctrl.updateContactById);

router.delete("/:contactId", ctrl.deleteContactById);

router.patch(
  "/:contactId/favorite",
  validateBody(updateFavoriteSchema),
  ctrl.updateStatusById
);

module.exports = router;
