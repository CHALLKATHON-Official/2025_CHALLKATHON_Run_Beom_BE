const userId = 'hoho'; // 사용자 ID

fetch(fetch(`https://two025-challkathon-run-beom-be.onrender.com/status/${userId}`)
)
  .then((res) => res.json())
  .then((data) => {
    const wasted = data.wastedTime || 0;

    // 이미지 크기 조절 (최소 0.2배 ~ 최대 1배)
    const maxTime = 180;
    const minScale = 0.2;
    const scale = Math.max(minScale, 1 - wasted / maxTime);

    const img = document.querySelector('.alice-img');
    if (img) {
      img.style.transform = `scale(${scale})`;
      img.style.transition = 'transform 0.3s ease';
    }

    const status = document.getElementById('status');
    if (status) {
      status.innerText = `오늘 낭비한 시간: ${wasted}분`;
    }
  })
  .catch((err) => {
    console.error('❌ 사용자 데이터 불러오기 실패:', err);
    const status = document.getElementById('status');
    if (status) {
      status.innerText = '❌ 사용자 데이터를 불러올 수 없습니다.';
    }
  });
