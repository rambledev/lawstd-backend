const express = require("express");
const {
    getTotalUsers,
    getTotalStudents,
    getTotalNews,
    getTotalSubjects,
    getTotalUploads,
    insertLoggedUser,
    getUserGraph,
    getVdoStat
} = require("../controllers/dashboardController");

const router = express.Router();

router.post("/addlogged", insertLoggedUser);
router.get("/total-users", getTotalUsers);
router.get("/total-students", getTotalStudents);
router.get("/total-news", getTotalNews);
router.get("/total-subjects", getTotalSubjects);
router.get("/total-uploads", getTotalUploads);
router.get("/usergraph", getUserGraph);
router.get("/vdograph", getVdoStat);




module.exports = router;
