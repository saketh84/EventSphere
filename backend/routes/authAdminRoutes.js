const express = require("express");

const router = express.Router();

const {

    signupAdmin,

    registerAdmin,

    loginAdmin,

    getAllAdmins,

    deleteAdmin,

    assignVolunteer,
    getProfile

} = require("../controllers/authAdminController");

const { protect } =
    require("../middleware/authMiddleware");

const authorize =
    require("../middleware/authorize");
const { getDashboard } = require("../controllers/authAdminController");

router.post(
    "/signup",
    signupAdmin
);

router.post(
    "/register",
    registerAdmin
);

router.post(
    "/login",
    loginAdmin
);
console.log("protect =", typeof protect);

console.log("authorize =", typeof authorize);

console.log(
    "getAllAdmins =",
    typeof getAllAdmins
);

console.log(
    "getProfile =",
    typeof getProfile
);

console.log(
    "deleteAdmin =",
    typeof deleteAdmin
);


router.get(

    "/users",

    protect,

    authorize(
        "admin",
        "superadmin"
    ),

    getAllAdmins
);

router.delete(

    "/users/:id",

    protect,

    authorize(
        "superadmin"
    ),

    deleteAdmin
);
router.get("/dashboard", protect, authorize("superadmin"), getDashboard);

router.post(
    "/assign",
    protect,
    authorize(
        "admin",
        "superadmin"
    ),
    assignVolunteer
);

router.get(
    "/profile",
    protect,
    authorize("admin", "superadmin", "volunteer"),
    getProfile
);

module.exports = router;