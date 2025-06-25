// controllers/screentimeController.js
const db = require('../config/db');

exports.saveScreenTime = async (req, res) => {
  const { userId, youtubeTime, instagramTime } = req.body;

  if (!userId || youtubeTime == null || instagramTime == null) {
    return res.status(400).json({ message: '❌ 필요한 정보가 없습니다.' });
  }

  try {
    const existing = await db.query(
      'SELECT * FROM screentimes WHERE user_id = $1 AND date = CURRENT_DATE',
      [userId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE screentimes SET youtube_time = $1, instagram_time = $2 WHERE user_id = $3 AND date = CURRENT_DATE',
        [youtubeTime, instagramTime, userId]
      );
    } else {
      await db.query(
        'INSERT INTO screentimes (user_id, youtube_time, instagram_time) VALUES ($1, $2, $3)',
        [userId, youtubeTime, instagramTime]
      );
    }

    res.json({ message: '✅ 저장 완료!' });
  } catch (err) {
    console.error('DB 오류:', err);
    res.status(500).json({ message: '❌ 서버 오류' });
  }
};
