const db = require('../config/db');

exports.saveScreenTime = async (req, res) => {
  const { userId, youtubeTime, instagramTime } = req.body;
  if (!userId || youtubeTime == null || instagramTime == null) {
    return res.status(400).json({ message: '❌ 필수 데이터 누락' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id FROM screentimes WHERE user_id = $1 AND date = CURRENT_DATE',
      [userId]
    );

    if (rows.length > 0) {
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

    return res.json({ message: '✅ 저장 완료' });
  } catch (err) {
    console.error('❌ 스크린타임 저장 오류:', err);
    return res.status(500).json({ message: '❌ 서버 오류' });
  }
};
