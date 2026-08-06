# JoosAtlas v9.0.1 GitHub Pages 교체 안내

## 교체 대상
이번 패키지는 기존 v8의 부정확한 method-chain 그림과 불일치하던 Pixel Lab을 교체합니다.

## 핵심 안전장치
- 새 CSS: `joosatlas-v9.css`
- 새 JavaScript: `joosatlas-v9.js`

파일명을 변경했으므로 브라우저가 오래된 v8 CSS/JS를 섞어 쓰지 않습니다.

## 업로드
1. ZIP을 압축 해제합니다.
2. GitHub 저장소 `daejinpipero-gaja/JoosAtlas`로 이동합니다.
3. `Add file` → `Upload files`를 누릅니다.
4. 압축을 푼 폴더 안의 모든 파일과 폴더를 업로드합니다.
5. Commit summary: `Correct method chain, equations and sensitivity lab`
6. `Commit directly to the main branch`를 선택하고 커밋합니다.
7. 1–3분 후 `https://daejinpipero-gaja.github.io/JoosAtlas/`에서 `Ctrl+F5`를 누릅니다.

## 기존 파일 정리
기존 `styles.css`, `app.js`, `assets/figures/method-chain.svg`는 v9에서 참조하지 않습니다. 저장소에 남아 있어도 사이트 작동에는 영향을 주지 않지만, 정리하려면 삭제할 수 있습니다.

## 확인 항목
- Theory의 01–05 버튼이 각각 한 장면만 표시하는지
- 12 m / 2.00 px 선택 시 12.36 cm와 `ABOVE 5 CM`이 함께 표시되는지
- 각 수식 아래 기호설명과 signed difference 부호표가 보이는지
