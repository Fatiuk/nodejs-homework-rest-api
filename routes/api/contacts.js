const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
const {
  authenticate,
  validateAddBody,
  validateObjectId,
  validateFavoriteBody,
} = require("../../middlewares");
const { addSchema, updateFavoriteSchema } = require("../../schemas");

router.get("/", authenticate, ctrl.getContactsList);

router.get("/:contactId", authenticate, validateObjectId, ctrl.getContactById);

router.post("/", authenticate, validateAddBody(addSchema), ctrl.addContact);

router.put(
  "/:contactId",
  authenticate,
  validateObjectId,
  validateAddBody(addSchema),
  ctrl.updateContactById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateObjectId,
  validateFavoriteBody(updateFavoriteSchema),
  ctrl.updateStatusById
);

router.delete(
  "/:contactId",
  authenticate,
  validateObjectId,
  ctrl.deleteContactById
);

module.exports = router;
