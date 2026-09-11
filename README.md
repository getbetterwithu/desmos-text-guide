# Amplify 수업자료 도구 모음

중학교 수학 Amplify Classroom 수업자료를 만들 때 쓰는 도구들입니다.

**https://getbetterwithu.github.io/desmos-text-guide/**

| 페이지 | 내용 |
|---|---|
| `index.html` | 홈 — 도구 카드 목록 |
| `text.html` | 글자 꾸미기 (크기·색·굵게) |
| `math.html` | 수식 입력 (명령어 25개 + 복사용 기호 23개) |
| `convert.html` | 수식 변환 (교과서 사진 → Amplify 수식) |

## 페이지를 추가하려면

`index.html` 아래쪽 `PAGES` 배열에 한 줄만 넣으면 카드가 생깁니다.

```js
{ icon:"📊", title:"새 도구", url:"new.html", color:"#0f4c81",
  desc:"무엇을 하는 도구인지 한두 문장." },
```

## 수식 변환 도구 설정

사용자는 각자 자기 API 키를 넣어 씁니다 (키는 그 사람 브라우저에만 저장).

| 고를 수 있는 곳 | 기본 모델 | 비고 |
|---|---|---|
| Google Gemini | `gemini-3.7-flash` | 무료 등급 있음 — 기본값 |
| OpenAI | `gpt-5.5` | 유료 |
| Anthropic Claude | `claude-sonnet-5` | 유료 |
| **직접 입력** | (직접) | 학교·기관에서 받은 Base URL |

### 모델 이름이 바뀌었을 때

AI 회사들이 모델을 자주 갈아치우기 때문에 기본값은 언젠가 낡습니다.
그래서 **[목록 불러오기]** 버튼을 두었습니다 — 키를 넣고 누르면 그 계정에서
실제로 쓸 수 있는 모델을 받아와 고를 수 있습니다. 코드를 고칠 필요가 없습니다.

(Claude만 목록 API가 없어 이름을 직접 넣어야 합니다.)

### Base URL

직접 입력에서는 받으신 주소를 그대로 넣으면 됩니다. 아래가 모두 같게 동작합니다.

```
https://api.example.com            → .../v1/chat/completions
https://api.example.com/v1         → .../v1/chat/completions
https://api.example.com/v1/chat/completions  (그대로)
```

**모델 이름은 직접 바꿀 수 있습니다.** 새 모델이 나오면 그 칸만 고치면 되고,
코드를 손댈 필요가 없습니다. 제공자를 늘리려면 `convert.html`의 `PROV`에 한 줄 추가합니다.

```js
newone:{ name:'표시 이름', model:'기본모델', kind:'openai',
  ep:'https://api.example.com/v1/chat/completions',
  url:'키 받는 주소', note:'안내 문구' },
```

`kind`는 `gemini` · `claude` · `openai` 셋뿐입니다. 대부분 OpenAI 호환이라 `openai`면 됩니다.

> 브라우저에서 직접 호출하려면 그 서비스가 CORS를 허용해야 합니다.
> Gemini·OpenAI·Claude는 2026-09-11에 실측으로 확인했습니다.
> Upstage Solar는 CORS는 되지만 **모델이 이미지를 읽지 못해** 목록에서 뺐습니다.

**[저장하고 연결 확인]은 1×1 이미지를 실제로 보내 봅니다** — 키가 맞는지뿐 아니라
그 모델이 이미지를 읽을 수 있는지까지 걸러집니다.

키 발급 안내: [노션 페이지](https://juneywooky.notion.site/Gemini-API-3d8cd3403dc38142aff2c200dc32390a)

### 공유 키 (선택)

암호를 아는 사람이 관리자 키로 쓰게 하려면 Vercel 프록시를 연결합니다.
키가 브라우저에 노출되지 않도록 서버를 거치는 구조입니다.

1. [vercel.com](https://vercel.com)에서 이 레포를 Import
2. 환경변수 2개 등록
   - `GEMINI_API_KEY` — 공유용 키 (주력 키 말고 이 용도로 새로 발급 권장)
   - `SHARE_PASSWORD` — 공유 암호
3. 배포 후 나온 주소로 `shared-config.js` 작성 (`shared-config.example.js` 참고)

```js
window.SHARE_ENDPOINT = "https://<프로젝트>.vercel.app/api/convert";
```

`shared-config.js`는 gitignore 대상입니다. GitHub Pages에만 올리려면
`git add -f shared-config.js` 로 강제 추가하거나, 파일 없이 두면
공유 탭이 자동으로 숨겨집니다.

> 공유 키에는 [Google Cloud 콘솔](https://console.cloud.google.com/apis/credentials)에서
> 일일 사용량 상한을 걸어두시길 권합니다.

## 수식 미리보기

Amplify는 수식을 **MathQuill**로 그립니다 (KaTeX 아님).
`lib/`에 그 라이브러리를 두고 같은 엔진으로 렌더하므로,
미리보기 화면이 Amplify에서 보일 모양과 같습니다.

⚠️ GitHub Pages는 밑줄로 시작하는 폴더를 제외하므로 `_mq/`가 아니라 `lib/`입니다.

---

2026 서울대학교사범대학부설중학교 허철호
