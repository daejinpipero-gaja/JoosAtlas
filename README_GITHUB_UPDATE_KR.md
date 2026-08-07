# JoosAtlas v10.1 — GitHub Pages 배포 안내

## 1. 이 패키지에 들어 있는 것

```
index.html            홈
case-001.html         Case 001 (이론 · 실험실 · 차트 · 증거 · 주장 경계)
about.html            주용회 프로필
404.html              존재하지 않는 경로
joosatlas-v10.css     스타일시트 1개
joosatlas-v10.js      스크립트 1개 (외부 의존성 없음)
assets/               이미지 · 도형 · 데이터
docs/                 공개 범위 · 릴리스 노트 · 검증 기록
tools/                구도 자동 검사기 (얼굴·심벌 잘림 검출)
previews/             배포 전 확인용 스크린샷
favicon.svg  robots.txt  sitemap.xml  site.webmanifest  .nojekyll
VERSION.json  PACKAGE_MANIFEST.json  SHA256SUMS.txt
```

## 2. 배포 절차

1. 저장소 `daejinpipero-gaja/JoosAtlas`의 기본 브랜치를 엽니다.
2. **기존 v9 파일을 먼저 지웁니다.** 특히 `joosatlas-v9.css`, `joosatlas-v9.js`, 그리고 v8 이전의 `styles.css`, `app.js`가 남아 있으면 삭제하십시오. 남겨 두어도 화면에는 영향이 없지만, 저장소가 지저분해지고 캐시 혼선의 원인이 됩니다.
3. 이 패키지의 **내용물 전체**를 저장소 루트에 올립니다. (`JoosAtlas_v10_GitHub_Deploy` 폴더째로 올리면 안 됩니다. 폴더 안의 파일들이 루트에 놓여야 합니다.)
4. 커밋하고 푸시합니다.
5. Settings → Pages 에서 Source가 기본 브랜치의 `/ (root)`인지 확인합니다.
6. 1–2분 뒤 <https://daejinpipero-gaja.github.io/JoosAtlas/> 에서 확인합니다.

## 3. 캐시 문제가 보일 때

CSS와 JS 파일명이 v9와 다르기 때문에(`joosatlas-v10.*`) 브라우저가 예전 파일을 섞어 쓰는 일은 생기지 않습니다. 그래도 화면이 이상하면 강력 새로고침(Windows `Ctrl+Shift+R`, macOS `⌘+Shift+R`)을 한 번 하십시오.

## 4. 배포 후 3분 점검

- [ ] 홈 상단 사진이 뜨고, 헤더 글자가 사진 위에서 읽힙니다.
- [ ] 헤더의 달/해 아이콘을 누르면 밝은 테마와 어두운 테마가 바뀝니다. 새로고침해도 선택이 유지됩니다.
- [ ] `⌘K`(또는 `Ctrl+K`, 또는 `/`)를 누르면 검색창이 열리고, "geom"처럼 입력하면 해당 섹션으로 이동합니다.
- [ ] Case 001 → 05 실험실에서 슬라이더를 움직이면 두 눈금자, 네 개의 수치 타일, 아래 곡선 그래프의 금색 표시가 함께 움직입니다.
- [ ] Case 001 → 06 관측 기하 그래프에서 C3 / R3 / D3 점에 마우스를 올리면 거리와 방위각이 나옵니다.
- [ ] Case 001 → 07 증거에서 C3 / R3 / D3 및 Plan / 3D 버튼이 이미지와 수치를 함께 바꿉니다.
- [ ] 휴대폰에서 우측 상단 `INDEX` 버튼으로 메뉴가 열립니다.

## 4-2. v10.1에서 바뀐 것

- **이름 표기**를 `Yonghoe JOO`(이름 먼저, 성은 대문자)로 통일했습니다. 프로필에는 `주용회`를 나란히 표기하고, 구조화 데이터에는 `givenName` / `familyName`을 따로 넣어 검색엔진과 인용 도구가 순서를 착각하지 않게 했습니다.
- **3인칭 문장을 1인칭으로** 모두 바꿨습니다. 자기 홈페이지에서 "He is also President of…"는 보도자료처럼 읽힙니다. 자화자찬으로 읽힐 수 있는 단어(rigorous 등)와 구호형 제목도 뺐습니다. 첫 문장은 이제 "I work between a laboratory and an industrial yard."이고, 아직 끝나지 않은 일은 끝나지 않았다고 적었습니다.
- **연락처**를 프로필 하단, 모든 페이지 푸터, ⌘K 팔레트 세 곳에 넣었습니다. (`daejinpipero@yonsei.ac.kr`, `daejinpipero@gmail.com`)
- **인물과 심벌이 잘리던 문제**를 구조적으로 고쳤습니다. 강연 사진은 635×710의 거의 정사각형이라 가로로 넓은 배경으로 쓰면 머리가 잘리고 연단의 연세대 엠블럼도 사라집니다. 이제 원본 비율 그대로 자체 프레임 안에 놓고 글은 옆에 둡니다. 전면 사진 섹션은 900px 이하에서 사진과 글을 위아래로 분리하고, 넓은 화면에서는 글을 인물 반대편에 배치합니다.

### LinkedIn을 추가하고 싶을 때

`about.html`의 `<section id="contact">` 안 `contact-list` 블록에 아래 한 줄을 추가하면 됩니다. 각 페이지 푸터의 `<h4>Contact</h4>` 목록에도 같은 링크를 넣으십시오.

```html
<a href="https://www.linkedin.com/in/여기에-본인-주소">
  <span>Network</span><strong>linkedin.com/in/여기에-본인-주소</strong><b>LinkedIn ↗</b>
</a>
```

## 4-3. 구도 자동 검사

레이아웃을 고친 뒤에는 눈으로만 보지 말고 검사기를 돌리십시오. 네 페이지를 1440 / 1180 / 834 / 390 px에서 실제로 렌더링한 다음, 브라우저가 수행한 `object-fit: cover` 잘라내기를 그대로 다시 계산해서 보호 영역(머리, 연세대 엠블럼, 상반신, 용접공과 불꽃, 사옥과 파이프 야드)이 화면 밖으로 나갔는지 판정합니다. 이어서 렌더링된 픽셀에 얼굴 검출과 템플릿 매칭을 돌려 머리 위 여백과 엠블럼 존재를 눈이 아니라 수치로 확인합니다.

```
python3 -m http.server 8899
node tools/visual_audit.mjs
```

현재 상태는 **108개 검사 전부 통과**입니다. 자세한 사용법은 `tools/README.md`에 있습니다.

## 5. 값이 바뀌면 함께 고쳐야 하는 곳

수치를 한 곳만 고치면 다른 곳과 어긋납니다. 아래 세 곳은 항상 같이 보십시오.

| 값 | 위치 |
|---|---|
| C3 / R3 / D3 의 RMSE · 평균 · 최대 · 점 개수 | `joosatlas-v10.js` 상단 `TS` 배열, `case-001.html`의 잔차 표, 그리고 `assets/data/ts_summary.json` |
| 7 / 9 / 12 m 의 mm/px 값 | `joosatlas-v10.js` 상단 `RANGES` 배열, `case-001.html`의 곡선 표와 범례, `index.html`의 설명문 |
| ΔR 부호 해석 | `case-001.html`의 「Algebraic sign of the displayed definition」 표 |

**부호 규약은 최종 게재 원고와 반드시 일치해야 합니다.** 원고에서 뺄셈 순서가 바뀌면 사이트의 부호 설명도 함께 뒤집어야 합니다.

## 6. 공개 범위

원좌표, 27개 조건 전체의 터미널 이미지 감사 결과, 캘리브레이션 파일, 심사 서신은 이 패키지에 포함되어 있지 않으며 공개되지 않습니다. 자세한 내용은 `docs/PUBLIC_DISCLOSURE.md`를 보십시오.
