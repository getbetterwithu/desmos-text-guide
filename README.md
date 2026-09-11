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
Gemini · OpenAI · Claude 중에서 고를 수 있고, 기본은 무료 등급이 있는 Gemini입니다.

키 발급 안내: [노션 페이지](https://getbetterwithu.notion.site/Gemini-API-3d8cd3403dc38142aff2c200dc32390a)

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
