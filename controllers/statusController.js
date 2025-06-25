const db = require('../db');

exports.getTodayStatus = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: '❌ userId가 없습니다.' });
  }

  try {
    const result = await db.query(
      'SELECT youtube_time, instagram_time FROM screentimes WHERE user_id = $1 AND date = CURRENT_DATE',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ wastedTime: 0 });
    }

    const { youtube_time, instagram_time } = result.rows[0];
    const total = youtube_time + instagram_time;

    res.json({ wastedTime: total });
  } catch (err) {
    console.error('❌ 상태 조회 오류:', err);
    res.status(500).json({ message: '❌ 서버 오류' });
  }
};
