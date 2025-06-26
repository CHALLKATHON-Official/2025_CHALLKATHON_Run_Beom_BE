const db = require('../config/db');

exports.getTodayStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT 
         COALESCE(youtube_time, 0) 
       + COALESCE(instagram_time, 0) AS wasted_time
       FROM screentime
       WHERE user_id = $1 
         AND date    = CURRENT_DATE`,
      [userId]
    );

    const wastedTime = rows.length ? rows[0].wasted_time : 0;
    return res.json({ wastedTime });
  } catch (err) {
    console.error('오늘 상태 조회 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
};
