document.querySelectorAll('.emotion').forEach((btn) => {
  btn.addEventListener('click', () => {
    document
      .querySelectorAll('.emotion')
      .forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');

    const emotionText = btn.dataset.value;
    const bgImg = btn.dataset.bg;
    const displayEmotion = emotionText === '우울' ? '슬픔' : emotionText;

    let emotionClass = '';
    switch (emotionText) {
      case '분노':
        emotionClass = 'anger-style';
        break;
      case '슬픔':
      case '우울':
        emotionClass = 'sad-style';
        break;
      case '설렘':
        emotionClass = 'flutter-style';
        break;
      case '행복':
        emotionClass = 'happy-style';
        break;
      case '평온':
        emotionClass = 'calm-style';
        break;
    }

    document.body.style.backgroundImage = `url('${bgImg}')`;

    document.getElementById('selectedEmotionText').innerHTML = `
      당신의 감정: <span class="emotion-tag ${emotionClass}">${displayEmotion}</span>
    `;

    document.getElementById('diarySection').style.display = 'block';
    document.getElementById('emotionContainer').style.display = 'none';

    const resultEl = document.getElementById('result');
    resultEl.innerHTML = '';
    resultEl.style.display = 'none';
  });
});

function submitDiary() {
  const input = document.getElementById('diaryInput').value;
  const resultEl = document.getElementById('result');

  if (!input.trim()) {
    alert('기억을 남기기 전에 내용을 입력해주세요.');
    return;
  }

  const selectedEmotions = Array.from(
    document.querySelectorAll('.emotion.selected')
  );
  const emotionText = selectedEmotions[0]?.dataset.value || '';
  const displayEmotion = emotionText === '우울' ? '슬픔' : emotionText;

  let emotionClass = '';
  switch (emotionText) {
    case '분노':
      emotionClass = 'anger-style';
      break;
    case '슬픔':
    case '우울':
      emotionClass = 'sad-style';
      break;
    case '설렘':
      emotionClass = 'flutter-style';
      break;
    case '행복':
      emotionClass = 'happy-style';
      break;
    case '평온':
      emotionClass = 'calm-style';
      break;
  }

  let message = `"${input}"\n...기억이 시간 속에 저장되었습니다.`;
  if (emotionText) {
    message += `\n\n📌 감정 기록: <span class="emotion-tag ${emotionClass}">${displayEmotion}</span>`;
  }

  resultEl.innerHTML = message;
  resultEl.style.display = 'block';

  document.getElementById('diaryInput').value = '';
  selectedEmotions.forEach((btn) => btn.classList.remove('selected'));
}

window.onload = () => {
  const resultEl = document.getElementById('result');
  resultEl.innerHTML = '';
  resultEl.style.display = 'none';
};
