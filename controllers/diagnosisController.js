const { query } = require("../database/Db");
const slugify = require("slugify");


const createHistory = async (req, res) => {
  console.log(req);
  const { predicted_class, confidence } = req.body;
  const slug = slugify(predicted_class + "-" + Math.floor(Math.random() * 10000), { lower: true });

  try {
    const sql = "INSERT INTO history (slug, predicted_class, confidence, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())";
    await query(sql, [slug, predicted_class, confidence]);
    return res.status(201).json({ 
      success: true,
      slug: slug,
      message: "Berhasil dibuat",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
};


const getHistoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "SELECT * FROM history WHERE slug = ?";
    const result = await query(sql, [id]);
    if (result.length > 0) {
      return res.status(200).json({ data: result[0] });
    } else {
      return res.status(404).json({ error: "konten tidak ditemukan" });
    }
  } catch (error) {
    return res.status(500).json({ error: "terjadi kesalahan" });
  }
};
module.exports = {createHistory, getHistoryById};
