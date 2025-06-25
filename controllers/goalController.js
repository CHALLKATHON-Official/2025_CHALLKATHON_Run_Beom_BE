const db = require('../db');

exports.saveGoal     = async (req, res) => {
  const userId   = req.user.id;
  const { goalTime } = req.body;
  if (!goalTime) return res.status(400).json({ message: 'goalTime 누락' });

  try {
    const exists = await db.query(
      `SELECT id FROM goals WHERE user_id=$1 AND date=CURRENT_DATE`,
      [userId]
    );

    if (exists.rows.length) {
      await db.query(
        `UPDATE goals SET goal_time=$1 WHERE user_id=$2 AND date=CURRENT_DATE`,
        [goalTime, userId]
      );
    } else {
      await db.query(
        `INSERT INTO goals (user_id, goal_time) VALUES ($1, $2)`,
        [userId, goalTime]
      );
    }
    res.json({ message: '목표 저장 완료' });
  } catch (err) {
    console.error('목표 저장 오류', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.getGoal      = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await db.query(
      `SELECT goal_time FROM goals WHERE user_id=$1 AND date=CURRENT_DATE`,
      [userId]
    );
    res.json({ goalTime: rows[0]?.goal_time || null });
  } catch (err) {
    console.error('목표 조회 오류', err);
    res.status(500).json({ message: '서버 오류' });
  }
};
