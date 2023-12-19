const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
const {
  validateAddBody,
  validateObjectId,
  validateFavoriteBody,
} = require("../../middlewares");
const { addSchema, updateFavoriteSchema } = require("../../schemas");

router.get("/", ctrl.getContactsList);

router.get("/:contactId", validateObjectId, ctrl.getContactById);

router.post("/", validateAddBody(addSchema), ctrl.addContact);

router.put(
  "/:contactId",
  validateObjectId,
  validateAddBody(addSchema),
  ctrl.updateContactById
);

router.patch(
  "/:contactId/favorite",
  validateObjectId,
  validateFavoriteBody(updateFavoriteSchema),
  ctrl.updateStatusById
);

router.delete("/:contactId", validateObjectId, ctrl.deleteContactById);

module.exports = router;
