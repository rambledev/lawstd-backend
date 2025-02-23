const { QueryTypes } = require("sequelize");
const db = require("../config/db");

// นับจำนวนผู้ใช้ทั้งหมด
exports.getTotalUsers = async (req, res) => {
    try {
        const results = await db.query("SELECT COUNT(*) as total FROM tb_logged", {
            type: QueryTypes.SELECT
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching total users:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// นับจำนวนนักเรียนทั้งหมด
exports.getTotalStudents = async (req, res) => {
    try {
        const results = await db.query("SELECT COUNT(*) as total FROM tb_student", {
            type: QueryTypes.SELECT
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching total students:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// นับจำนวนข่าวที่เผยแพร่
exports.getTotalNews = async (req, res) => {
    try {
        const results = await db.query("SELECT COUNT(*) as total FROM tb_news", {
            type: QueryTypes.SELECT
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching total news:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// นับจำนวนรายวิชาทั้งหมด
exports.getTotalSubjects = async (req, res) => {
    try {
        const results = await db.query("SELECT COUNT(*) as total FROM tb_subject", {
            type: QueryTypes.SELECT
        });
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching total subjects:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// นับจำนวนวิดีโอที่อัปโหลดล่าสุด
exports.getTotalUploads = async (req, res) => {
    try {
        const results = await db.query(
            `SELECT 
                (SELECT COUNT(*) FROM tb_vdo) + (SELECT COUNT(*) FROM tb_files) AS total`,
            { type: QueryTypes.SELECT }
        );

        res.json(results[0]); 
    } catch (error) {
        console.error("Error fetching latest uploads:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



// เพิ่มข้อมูลลงใน tb_logged
exports.insertLoggedUser = async (req, res) => {
    try {
        const { username, usertype } = req.body; // เข้าถึง usertype จาก req.body
        
        console.log("Received username:", username);
        console.log("Received usertype:", usertype);

        if (!username || !usertype) {
            return res.status(400).json({ message: "Username and usertype are required" });
        }

        await db.query("INSERT INTO tb_logged (username, usertype) VALUES (:username, :usertype)", {
            type: QueryTypes.INSERT,
            replacements: { username, usertype }
        });

        res.json({ message: "User logged successfully" });
    } catch (error) {
        console.error("Error inserting logged user:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



// นับจำนวนวิดีโอที่อัปโหลดล่าสุด
exports.getUserGraph = async (req, res) => {
    try {
        const results = await db.query(
            `SELECT usertype, COUNT(*) as total FROM tb_logged GROUP BY usertype; `,
            { type: QueryTypes.SELECT }
        );

        // ส่งคืนผลลัพธ์ทั้งหมด (ไม่ต้องใช้ results[0])
        res.json({
            labels: results.map(row => row.usertype),
            data: results.map(row => row.total)
        });
    } catch (error) {
        console.error("Error fetching latest uploads:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



exports.getVdoStat = async (req, res) => {
    try {
        const results = await db.query(
            `SELECT vdv.vdo_id, vdv.view_count, vdo.vdo_name, vdo.sub_code, sub.sub_name 
            FROM ( 
                SELECT vdo_id, COUNT(*) AS view_count 
                FROM tb_vdo_views 
                GROUP BY vdo_id 
                ORDER BY view_count DESC 
                LIMIT 5 
            ) AS vdv 
            JOIN tb_vdo vdo ON vdv.vdo_id = vdo.id 
            JOIN tb_subject sub ON vdo.sub_code = sub.sub_code; `,
            { type: QueryTypes.SELECT }
        );

        // จัดข้อมูลเป็นรูปแบบ labels และ data
        const labels = results.map(row => row.vdo_name); // ใช้ชื่อวิดีโอ
        const data = results.map(row => row.view_count); // ใช้จำนวนการเข้าชม

        res.json({
            labels: labels,
            data: data
        });
    } catch (error) {
        console.error("Error fetching video stats:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
