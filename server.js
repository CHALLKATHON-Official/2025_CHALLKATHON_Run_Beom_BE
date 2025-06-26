const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: '토큰 없음' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: '유효하지 않은 토큰' });
  }
}

app.post('/signup', async (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) return res.status(400).json({ message: '정보 부족' });

  try {
    const existing = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다' });
    }

    await pool.query('INSERT INTO users (id, password) VALUES ($1, $2)', [id, pw]);
    res.status(200).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('회원가입 중 DB 오류', err);
    res.status(500).json({ message: 'DB 오류' });
  }
});

app.post('/login', async (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) return res.status(400).json({ message: '정보 부족' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0 || result.rows[0].password !== pw) {
      return res.status(401).json({ message: '아이디 또는 비밀번호 오류' });
    }

    const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB 오류' });
  }
});

const { saveGoal, getGoal } = require('./controllers/goalController');
app.post('/goal', authMiddleware, saveGoal);
app.get('/goal',  authMiddleware, getGoal);


app.post('/screentime', authMiddleware, async (req, res) => {
  const { planned, timestamp } = req.body;
  const userId = req.user.id;

  if (typeof planned !== 'boolean' || !timestamp) {
    return res.status(400).json({ message: '데이터 누락 또는 형식 오류' });
  }

  try {
    await pool.query(
      'INSERT INTO screentime (user_id, planned, timestamp) VALUES ($1, $2, $3)',
      [userId, planned, timestamp]
    );
    res.json({ message: '저장 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB 오류' });
  }
});


app.get('/goal', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT goal_time
         FROM goals
        WHERE user_id = $1
          AND date = CURRENT_DATE`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.json({ goalTime: null });
    }
    res.json({ goalTime: result.rows[0].goal_time });
  } catch (err) {
    console.error('📌 /goal 조회 오류:', err);
    res.status(500).json({ message: '❌ 서버 오류' });
  }
});


app.get('/character-state', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT planned FROM screentime WHERE user_id = $1',
      [userId]
    );

    const logs = result.rows;
    const score = logs.reduce((acc, log) => acc + (log.planned ? 1 : -1), 0);
    const level = Math.max(0, Math.floor(score / 5));
    let message = '🪴 아직 작지만 가능성이 보여요!';
    if (level >= 3) message = '🌳 캐릭터가 잘 자라고 있어요!';
    if (level >= 6) message = '🌟 전설의 캐릭터로 진화 중!';

    res.json({ sizeLevel: level, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB 오류' });
  }
});

const screentimeRoutes = require('./routes/screentime');
const statusRoutes = require('./routes/status');
const rankingRoutes = require('./routes/ranking');
const goalRoutes       = require('./routes/goal');

app.use('/screentime-v2', screentimeRoutes);  
app.use('/status', statusRoutes);
app.use('/ranking', rankingRoutes);
app.use('/goal', goalRoutes);

const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: https://two025-challkathon-run-beom-be.onrender.com`);
});