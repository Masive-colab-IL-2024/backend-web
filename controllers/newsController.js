const { query } = require("../database/Db");
const slugify = require("slugify");

const Getails = async (req, res) => {
  try {
    const result = await query("SELECT * FROM news");
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: "terjadi kesalahan" });
  }
};

const getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "SELECT * FROM news WHERE slug = ?";
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

const createNews = async (req, res) => {
  const { title, content, categories, author } = req.body;
  const imageFilename = req.file ? req.file.filename : null;
  const imageUrl = imageFilename ? `${req.protocol}://${req.get('host')}/uploads/${imageFilename}` : null;
  const slug = slugify(title + "-" + Math.floor(Math.random() * 1000), { lower: true });

  try {
    const sql = "INSERT INTO news (slug, title, image, content, categories, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
    await query(sql, [slug, title, imageUrl, content, categories, author]);
    return res.status(201).json({ 
      success: true, 
      message: "Berita berhasil dibuat",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "terjadi kesalahan" });
  }
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, categories, author } = req.body;
  let imageUrl = null;

  try {
    if (req.file) {
      const imageFilename = req.file.filename;
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;
    } else {
      const checkExistenceSql = "SELECT * FROM news WHERE slug = ?";
      const [existingNews] = await query(checkExistenceSql, [id]);
      if (!existingNews) {
        return res.status(404).json({ error: "konten tidak ditemukan" });
      }
      imageUrl = existingNews.image;
    }

    const updateSql = "UPDATE news SET title = ?, content = ?, image = ?, categories = ?, author = ?, updatedAt = NOW() WHERE slug = ?";
    await query(updateSql, [title, content, imageUrl, categories, author, id]);

    return res.status(200).json({ success: true, message: "Berita berhasil diperbarui" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "terjadi kesalahan" });
  }
};



const deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const checkExistenceSql = "SELECT * FROM news WHERE slug = ?";
    const [existingNews] = await query(checkExistenceSql, [id]);

    if (!existingNews) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    const deleteSql = "DELETE FROM news WHERE slug = ?";

    await query(deleteSql, [id]);

    return res.status(200).json({ success: true, message: "Berita berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "terjadi kesalahan" });
  }
};

module.exports = {
  Getails,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
