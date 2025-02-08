// controllers/linksController.js
const db = require('../db'); 
const { QueryTypes } = require('sequelize'); 

// ดึงข้อมูลทั้งหมดจาก tb_links
exports.getLinks = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM tb_links ORDER BY level ASC', {
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
    const { name, link_url, level, parent_id } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Invalid 'name' value" });
    }
    if (!link_url || typeof link_url !== 'string') {
        return res.status(400).json({ message: "Invalid 'link_url' value" });
    }
    if (typeof level !== 'number') {
        return res.status(400).json({ message: "Invalid 'level' value" });
    }

    const parentIdValue = parent_id !== undefined ? parent_id : null;

    try {
        const result = await db.query(
            'INSERT INTO tb_links (name, link_url, level, parent_id) VALUES (?, ?, ?, ?)',
            {
                replacements: [name, link_url, level, parentIdValue],
                type: QueryTypes.INSERT
            }
        );

        res.status(201).json({
            id: result[0], 
            name,
            link_url,
            level,
            parent_id: parentIdValue
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

    try {
        const result = await db.query('DELETE FROM tb_links WHERE id = ?', {
            replacements: [id],
            type: QueryTypes.DELETE
        });

        if (result[1] === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};