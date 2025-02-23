// controllers/linksController.js
const db = require('../config/db.js'); 
const { QueryTypes } = require('sequelize'); 

// ดึงข้อมูลทั้งหมดจาก tb_links
exports.getLinks = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM tb_links ORDER BY id ASC', {
            type: QueryTypes.SELECT
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// เพิ่ม link ใหม่
exports.addLink = async (req, res) => {
    const {
        name = null,           // กำหนดค่าเริ่มต้นเป็น null
        link_url = null,      // กำหนดค่าเริ่มต้นเป็น null
        level = null,         // กำหนดค่าเริ่มต้นเป็น null
        parent_id = null      // กำหนดค่าเริ่มต้นเป็น null
    } = req.body;

    // ตรวจสอบค่า name และ link_url ว่าต้องไม่เป็น null
    // if (!name || typeof name !== 'string') {
    //     return res.status(400).json({ message: "Invalid 'name' value" });
    // }
    // if (link_url !== null && typeof link_url !== 'string') {
    //     return res.status(400).json({ message: "Invalid 'link_url' value" });
    // }
    // if (level !== null && typeof level !== 'number') {
    //     return res.status(400).json({ message: "Invalid 'level' value" });
    // }

    try {
        const result = await db.query(
            'INSERT INTO tb_links (name, link_url, level, parent_id) VALUES (?, ?, ?, ?)',
            {
                replacements: [name, link_url, level, parent_id],
                type: QueryTypes.INSERT
            }
        );

        res.status(201).json({
            id: result[0],
            name,
            link_url,
            level,
            parent_id
        });
    } catch (error) {
        console.error('Error adding link:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// อัปเดต link
exports.updateLink = async (req, res) => {
    const { id } = req.params;
    const { name, link_url, level, parent_id } = req.body;

    console.log("Request Body:", req.body); // Log ข้อมูลที่ได้รับจากคำขอ

    if (!name || !link_url || level === undefined || id === undefined) {
        return res.status(400).json({ message: "Invalid input, please provide name, link_url, level, and id." });
    }

    console.log(`Updating link with id: ${id}, name: ${name}, link_url: ${link_url}, level: ${level}, parent_id: ${parent_id}`);

    try {
        const query = `UPDATE tb_links SET name = ?, link_url = ?, level = ?, parent_id = ? WHERE id = ?`;
        const values = [name, link_url, level, parent_id || null, id];

        console.log("Executing query:", query, "with values:", values); // Log คำสั่ง SQL และค่าที่ส่ง

        const result = await db.query(query, {
            replacements: values,
            type: QueryTypes.UPDATE
        });

        console.log("Query Result:", result); // Log ผลลัพธ์ที่ได้รับจากการดำเนินการ SQL

        if (result[1] === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        res.json({ message: 'Link updated successfully' });
    } catch (error) {
        console.error('Error updating link:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// ลบ link

exports.deleteLink = async (req, res) => {
    const { id } = req.params;
    console.log('Deleting ID:', id); // ✅ Debug เช็คค่าที่ส่งมา

    try {
        const [result] = await db.query('DELETE FROM tb_links WHERE id = ?', {
            replacements: [id],
            type: QueryTypes.RAW // ✅ เปลี่ยนจาก DELETE เป็น RAW
        });

        console.log('Delete result:', result); // ✅ Debug ดูค่าที่ได้

        // เช็คจำนวนแถวที่ถูกลบ
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Link not found.' });
        }

        return res.status(200).json({ message: 'Link deleted successfully.', id });
    } catch (error) {
        console.error('Error deleting link:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the link.', error: error.message });
    }
};
