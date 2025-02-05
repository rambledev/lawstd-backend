// controllers/linksController.js
const db = require('../db'); // โหลดการเชื่อมต่อฐานข้อมูล

// หา links ทั้งหมด
exports.getLinks = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM tb_links');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// เพิ่ม link ใหม่
exports.addLink = async (req, res) => {
    const { name, level, parent_id } = req.body;

    console.log(req.body)
    // ตรวจสอบค่าที่ส่งมาและแสดงค่าที่จะส่งไปยัง SQL
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Invalid 'name' value" });
    }
    if (typeof level !== 'number') {
        return res.status(400).json({ message: "Invalid 'level' value" });
    }

    // ตั้งค่า default สำหรับ parent_id
    const parentIdValue = parent_id !== undefined ? parent_id : null;

    console.log(`Inserting into db: name=${name}, level=${level}, parent_id=${parentIdValue}`); // debug line

    try {
        const result = await db.query(
            'INSERT INTO tb_links (name, level, parent_id) VALUES (?, ?, ?)', 
            [name, level, parentIdValue]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            level,
            parent_id: parentIdValue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// อัปเดต link
exports.updateLink = async (req, res) => {
    const { id } = req.params; // รับ id จาก URL
    const { name, level, parent_id } = req.body;
    try {
        await db.query('UPDATE tb_links SET name = ?, level = ?, parent_id = ? WHERE id = ?', [name, level, parent_id, id]);
        res.json({ message: 'Link updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ลบ link
exports.deleteLink = async (req, res) => {
    const { id } = req.params; // รับ id จาก URL
    try {
        await db.query('DELETE FROM tb_links WHERE id = ?', [id]);
        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};