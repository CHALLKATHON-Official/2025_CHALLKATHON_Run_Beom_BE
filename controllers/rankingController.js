const db = require('../db');   

exports.getRanking = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT user_id,
             youtube_time  + instagram_time AS wasted_time
      FROM screentimes
      WHERE date = CURRENT_DATE
      ORDER BY wasted_time DESC
    `);

    const data = result.rows.map(row => ({
      userId:     row.user_id,
      wastedTime: row.wasted_time,
    }));

    res.json(data);
  } catch (err) {
    console.error('랭킹 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};
