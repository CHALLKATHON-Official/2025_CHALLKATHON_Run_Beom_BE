function showSignup() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
}
function showLogin() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}
async function register() {
  const id = document.getElementById('signup-id').value;
  const pw = document.getElementById('signup-pw').value;

  if (!id || !pw) {
    alert('아이디와 비밀번호를 입력하세요!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pw })
    });

    if (res.ok) {
      alert('회원가입이 완료되었습니다!');
      showLogin();
    } else {
      const data = await res.json();
      alert(`❌ 회원가입 실패: ${data.message || '오류 발생'}`);
    }
  } catch (error) {
    console.error('회원가입 중 오류:', error);
    alert('❌ 네트워크 오류 또는 서버 문제');
  }
}


async function login() {
  const id = document.getElementById('login-id').value;
  const pw = document.getElementById('login-pw').value;

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pw })
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.token;

      // JWT 토큰 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id); // 사용자 식별용

      // 기존 로그인 성공 시 동작 계속 실행
      const loginBox = document.getElementById('login-container');
      loginBox.classList.add('fade');
      loginBox.style.opacity = '0';

      setTimeout(() => {
        loginBox.style.display = 'none';

        const videoContainer = document.getElementById('video-container');
        const video = document.getElementById('intro-video');
        videoContainer.style.display = 'flex';

        video.play().catch(error => {
          console.error("영상 재생 실패:", error);
        });

        video.addEventListener('ended', () => {
          videoContainer.classList.add('fade-out');
          setTimeout(() => {
            videoContainer.style.display = 'none';
            document.getElementById('alice-container').style.display = 'block';
          }, 2000);
        });
      }, 2000);

    } else {
      const data = await res.json();
      document.getElementById('login-result').textContent =
        '❌ 로그인 실패: ' + (data.message || '오류 발생');
    }
  } catch (error) {
    console.error('로그인 중 오류:', error);
    document.getElementById('login-result').textContent = '❌ 서버 연결 실패';
  }
}

video.addEventListener('ended', async () => {
  videoContainer.classList.add('fade-out');

  setTimeout(async () => {
    videoContainer.style.display = 'none';
    document.getElementById('alice-container').style.display = 'block';

    // 💡 캐릭터 상태 조회
    await fetchCharacterState();

  }, 2000);
});


async function fetchCharacterState() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/character-state', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (res.ok) {
      const data = await res.json();
      const status = document.getElementById('status');
      status.textContent = `📊 캐릭터 상태: ${data.message || '정보 없음'}`;

      // 필요하다면 이미지/크기 조절 등도 여기서 처리 가능
    } else {
      const data = await res.json();
      console.error('캐릭터 상태 조회 실패:', data.message);
    }
  } catch (error) {
    console.error('캐릭터 상태 요청 오류:', error);
  }
}



async function useTime(planned) {
  const status = document.getElementById('status');
  status.textContent = planned
    ? "👏 시간을 계획대로 보냈어요!"
    : "😅 시간을 낭비했어요…";

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    console.error('로그인 정보 없음');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/screentime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        userId,
        planned,
        timestamp: new Date().toISOString()
      })
    });

    if (!res.ok) {
      const data = await res.json();
      console.error('❌ 저장 실패:', data.message || '서버 오류');
    }
  } catch (error) {
    console.error('스크린타임 저장 오류:', error);
  }
}
