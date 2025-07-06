const express = require("express")
const router = express.Router()
const { createUser, 
    getUsers, getOneUser, updateOneUser,deleteOneUser
} = require("../../controllers/admin/usermanagement")
const { authenticateUser, isAdmin} = require("../../middlewares/authorizedUser")
router.get("/users", authenticateUser, isAdmin, getUsers);
// 5 common api route

router.get(
    "/",
    // authenticateUser, 
    // isAdmin,
    getUsers
)
router.post(
    "/create",
    createUser
)



router.get(
    "/:id", // req.params.id
    getOneUser
)
router.put(
    "/:id", // req.params.id
    updateOneUser
)
router.delete(
    "/:id", // req.params.id
    deleteOneUser
)
module.exports = router