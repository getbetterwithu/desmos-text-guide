// 수식 변환 프록시 — 공유 키를 안전하게 쓰기 위한 중계
//
// 브라우저가 키를 직접 들고 있으면 개발자도구에서 보인다. 그래서 공유 키는
// 여기(서버)에만 두고, 사용자는 '공유 암호'만 보낸다. 키는 응답에도 담기지 않는다.
//
// Vercel 환경변수 2개
//   GEMINI_API_KEY   공유용 Gemini 키 (주력 키 말고 이 용도로 새로 발급 권장)
//   SHARE_PASSWORD   이 암호를 아는 사람만 공유 키를 쓸 수 있다
//
// 자기 키를 쓰는 사용자는 이 함수를 거치지 않고 브라우저에서 직접 호출한다.

const MODEL = 'gemini-2.5-flash';

export default async function handler(req, res) {
  // 이 프록시는 공개 페이지에서 부른다 — GitHub Pages 출처만 허용
  const origin = req.headers.origin || '';
  const allowed = [
    'https://getbetterwithu.github.io',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ];
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 받습니다.' });

  const key = process.env.GEMINI_API_KEY;
  const pass = process.env.SHARE_PASSWORD;
  if (!key || !pass) {
    return res.status(503).json({ error: '공유 키가 아직 설정되지 않았습니다. 자기 키를 등록해 사용해 주세요.' });
  }

  const { password, prompt, image, mime } = req.body || {};
  if (password !== pass) {
    return res.status(401).json({ error: '공유 암호가 맞지 않습니다.' });
  }
  if (!image || !prompt) {
    return res.status(400).json({ error: '이미지와 지시문이 필요합니다.' });
  }
  // 이미지 크기 상한 — 공유 키가 과하게 쓰이는 것을 막는다 (base64 기준 약 6MB)
  if (image.length > 8_000_000) {
    return res.status(413).json({ error: '이미지가 너무 큽니다. 더 작게 잘라서 올려 주세요.' });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mime || 'image/png', data: image } },
            ],
          }],
          generationConfig: { temperature: 0 },
        }),
      }
    );
    const data = await r.json();
    if (!r.ok) {
      // 구글이 준 오류를 그대로 넘기되, 키가 섞여 나가지 않게 메시지만 추린다
      const msg = data?.error?.message || '변환에 실패했습니다.';
      return res.status(r.status).json({ error: msg });
    }
    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: '변환 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}
