window.addEventListener('DOMContentLoaded', () => {

  const hourSel = document.getElementById('goal-hour');
  const minSel  = document.getElementById('goal-minute');
  if (!hourSel || !minSel) return;

  for (let h = 0; h < 24; h++) {
    const o = document.createElement('option');
    o.value = o.textContent = String(h).padStart(2, '0');
    hourSel.append(o);
  }
  for (let m = 0; m < 60; m++) {
    const o = document.createElement('option');
    o.value = o.textContent = String(m).padStart(2, '0');
    minSel.append(o);
  }

  const toggleBtn = document.getElementById('toggle-desc');
  const overlay   = document.getElementById('modal-overlay');
  const closeBtn  = document.getElementById('close-modal');
  if (toggleBtn && overlay && closeBtn) {
    toggleBtn.addEventListener('click', () => {
      overlay.style.display = 'flex';
    });
    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }
});


let loginMethod = '';
let userName = '';
const BASE_URL = 'https://two025-challkathon-run-beom-be.onrender.com';

// Google 로그인용 JWT 디코드
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

function handleGoogleLogin(response) {
  const payload = decodeJwtResponse(response.credential);
  loginMethod = 'google';
  userName = payload.name || payload.given_name || payload.email.split('@')[0];
  proceedToVideo();
}

function showSignup() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
}
function showLogin() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

function register() {
  const id = document.getElementById('signup-id').value.trim();
  const pw = document.getElementById('signup-pw').value.trim();
  const nickname = document.getElementById('signup-nickname').value.trim();
  const birth = document.getElementById('signup-birth').value;

  if (!id || !pw || !nickname || !birth) {
    alert('모든 정보를 입력하세요!');
    return;
  }

  fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, pw, nickname, birth }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || '가입되었습니다!');
      showLogin();
    })
    .catch(() => {
      alert('❌ 가입 실패');
    });
}

function login() {
  const id = document.getElementById('login-id').value;
  const pw = document.getElementById('login-pw').value;

  fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, pw }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('userId', id);
        loginMethod = 'jwt';
        userName = id;
        proceedToVideo();
      } else {
        document.getElementById('login-result').textContent = data.message || '❌ 로그인 실패';
      }
    })
    .catch(() => {
      document.getElementById('login-result').textContent = '❌ 로그인 요청 실패';
    });
}

function proceedToVideo() {
  const loginBox = document.getElementById('login-container');
  loginBox.classList.add('fade');
  loginBox.style.opacity = '0';

  setTimeout(() => {
    loginBox.style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';

    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) bgVideo.style.display = 'none';

    const vc = document.getElementById('video-container');
    const video = document.getElementById('intro-video');
    vc.style.display = 'flex';
    video.play().catch(console.error);

    video.addEventListener('ended', () => {
      vc.classList.add('fade-out');
      setTimeout(() => {
        vc.style.display = 'none';
        document.getElementById('alice-container').style.display = 'block';
        loadGoalTime();
      }, 1000);
    });
  }, 2000);
}


function setGoalTime() {
  const h = document.getElementById('goal-hour').value;
  const m = document.getElementById('goal-minute').value;
  if (h === '' || m === '') {
    alert('목표 시간을 선택해주세요.');
    return;
  }

  const timeInput = `${h}:${m}`;
  document.getElementById('goal-status').textContent =
    loginMethod === 'google'
      ? `${userName} 님의 목표 시간은 ${timeInput}으로 설정되었습니다.`
      : `${userName}님의 목표 시간은 ${timeInput}으로 설정되었습니다.`;

  const token = localStorage.getItem('jwt');
  fetch(`${BASE_URL}/goal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ goalTime: timeInput }),
  })
    .then(res => res.json())
    .then(data => {
      console.log('🎯 목표 시간 저장:', data.message);
    })
    .catch(err => {
      console.error('❌ 목표 시간 저장 실패:', err);
    });

  document.getElementById('alice-container').style.display = 'none';
  document.getElementById('intro-gif-container').style.display = 'block';

  setTimeout(() => {
    document.getElementById('intro-gif-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    loadWastedTime();
  }, 2000);
}

function loadWastedTime() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt');

  fetch(`${BASE_URL}/status/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      const wasted = data.wastedTime || 0;
      const scale = Math.max(0.2, 1 - wasted / 180);

      const img = document.querySelector('.alice-img');
      if (img) {
        img.style.transform = `scale(${scale})`;
        img.style.transition = 'transform 0.3s ease';
      }

      const status = document.getElementById('wasted-status');
      if (status) {
        status.innerText = `오늘 낭비한 시간: ${wasted}분`;
      }
    })
    .catch((err) => {
      console.error('❌ 사용자 데이터 불러오기 실패:', err);
      const status = document.getElementById('wasted-status');
      if (status) {
        status.innerText = '❌ 사용자 데이터를 불러올 수 없습니다.';
      }
    });
}

function loadGoalTime() {
  const token = localStorage.getItem('jwt');
  fetch(`${BASE_URL}/goal`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(({ goalTime }) => {
      if (!goalTime) return;
      const [h, m] = goalTime.split(':');
      document.getElementById('goal-hour').value = h;
      document.getElementById('goal-minute').value = m;
      document.getElementById('goal-status').textContent =
        loginMethod === 'google'
          ? `${userName} 님의 목표 시간은 ${goalTime}으로 설정되었습니다.`
          : `${userName}님의 목표 시간은 ${goalTime}으로 설정되었습니다.`;
    })
    .catch(console.error);
}
