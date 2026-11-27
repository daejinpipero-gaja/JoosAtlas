#!/usr/bin/env python3
"""
Authors the Korean dictionary for JoosAtlas and verifies that it covers every
translatable string extracted from the pages. Emits joosatlas-i18n.js.

Run:  python3 build_i18n.py
Fails loudly if a visible English string has no Korean counterpart.
"""
import json, re, sys, io

KR = {}

def add(d):
    for k, v in d.items():
        if k in KR and KR[k] != v:
            print(f'DUPLICATE KEY with different value: {k!r}')
        KR[k] = v

# ── Chrome, navigation, actions ──────────────────────────────────────────────
add({
 "Skip to content":"본문으로 건너뛰기",
 "Research · Field · Systems":"연구 · 현장 · 시스템",
 "Research · field · systems":"연구 · 현장 · 시스템",
 "Case 001 · Spatial evidence":"Case 001 · 공간 증거",
 "Measure · Verify · Explain":"측정 · 검증 · 설명",
 "Index":"목차","Home":"홈","About":"소개","Atlas":"아틀라스","Contact":"연락",
 "Premise":"전제","Experiment":"실험","Who":"소개","Question":"질문","Theory":"이론",
 "Lab":"실험실","Geometry":"기하","Evidence":"증거","Limits":"한계","Research":"연구",
 "Workshop":"작업장","Company":"회사","Community":"공동체","This page":"이 페이지",
 "This case":"이 사례","Equations":"수식",
 "Enter Case 001":"Case 001 열기",
 "Search the atlas":"아틀라스 검색",
 "Search everything":"전체 검색",
 "About Yonghoe JOO":"주용회 소개",
 "See the current work":"현재 연구 보기",
 "Write to me":"메일 보내기",
 "Read the longer account":"더 긴 이야기 읽기",
 "Read the method":"방법 읽기",
 "Open Case 001 ↗":"Case 001 열기 ↗",
 "Return to the atlas":"아틀라스로 돌아가기",
 "Open the working sensitivity lab":"감도 실험실 열기",
 "About the operating practice":"현장 실무에 대하여",
 "View full figure":"전체 그림 보기",
 "Show data table":"데이터 표 보기",
 "Hide data table":"데이터 표 닫기",
 "Close ×":"닫기 ×",
 "Reset":"초기화",
 "Set the 5 cm limit":"5 cm 한계로 맞추기",
 "GitHub ↗":"GitHub ↗","Yonsei ↗":"연세 ↗","Email ↗":"메일 ↗",
 "Academic":"학교","General":"일반","Source":"소스",
 "↑↓ navigate":"↑↓ 이동","↵ open":"↵ 열기","⌘K toggle":"⌘K 열고 닫기","T theme":"T 테마",
 "ESC":"ESC","JoosAtlas":"JoosAtlas",
 "Press ⌘K or / to search · T to switch theme":"⌘K 또는 / 로 검색 · T 로 테마 전환 · L 로 언어 전환",
})

# ── Home ─────────────────────────────────────────────────────────────────────
add({
 "Independent research platform":"독립 연구 플랫폼",
 "Research that survives contact with the field.":"현장을 견디는 연구.",
 "A public record of how spatial evidence moves between surveying, image geometry, industrial reality and accountable explanation — with the limits of every claim stated in the open.":
   "공간 증거가 측량과 영상 기하, 산업 현실과 책임 있는 설명 사이를 어떻게 오가는지에 대한 공개 기록입니다. 모든 주장의 한계를 함께 적었습니다.",
 "Field":"현장","Image":"영상","Audit":"감사","Status":"상태",
 "Physical datum first":"물리적 기준이 먼저",
 "Declared geometry":"선언된 기하",
 "Signed, traceable claim":"부호가 남은, 추적 가능한 주장",
 "Case 001 under review":"Case 001 심사 중",

 "Not every precise-looking line is a measurement.":"정밀해 보이는 선이 모두 측정은 아닙니다.",
 "JoosAtlas begins with a refusal: an image is not allowed to certify its own interpretation.":
   "JoosAtlas는 하나의 거절에서 시작합니다. 영상은 자기 자신의 해석을 스스로 증명할 수 없습니다.",
 "Observation, reference and audit are treated as different roles. The distinction is methodological, but it is also ethical: a result should be presented only at the level the evidence can support.":
   "관측과 기준, 감사는 서로 다른 역할로 다룹니다. 이 구분은 방법의 문제이면서 동시에 윤리의 문제입니다. 결과는 근거가 지탱할 수 있는 수준에서만 제시되어야 합니다.",
 "That principle connects the laboratory, the industrial yard and public communication. Each environment imposes a different test on the same question:":
   "이 원칙이 실험실과 산업 현장, 그리고 공개적인 설명을 하나로 잇습니다. 각 환경은 같은 질문에 서로 다른 시험을 부과합니다:",
 "what makes a claim defensible?":"무엇이 주장을 방어 가능하게 만드는가?",
 "Observe":"관측한다","Reference":"기준","Decide":"판단한다",
 "Record what the sensor sees.":"센서가 본 것을 기록합니다.",
 "Keep the raw response separate from its interpretation.":"원 응답을 그 해석과 분리해 둡니다.",
 "Preserve an independent physical basis.":"독립적인 물리적 근거를 남깁니다.",
 "The datum exists before the camera contributes anything.":"기준은 카메라가 무엇을 보태기 전에 이미 존재합니다.",
 "Permit or withhold the terminal claim.":"최종 주장을 허용하거나 보류합니다.",
 "Refusal is a result, not a failure.":"거절도 결과입니다. 실패가 아닙니다.",

 "60-second experiment":"60초 실험",
 "Local sensitivity":"국소 감도",
 "Two pixels are not two centimetres.":"2픽셀은 2센티미터가 아닙니다.",
 "The same image displacement produces a different local ground consequence as the viewing geometry changes. The chart uses the three selected local inverse-Jacobian scales disclosed in Case 001 — hover any bar for its 5 cm pixel limit.":
   "같은 영상 변위라도 관측 기하가 달라지면 지상에 미치는 국소 영향이 달라집니다. 아래 그래프는 Case 001에서 공개한 세 개의 국소 역야코비안 스케일을 사용합니다. 막대에 마우스를 올리면 각 조건의 5 cm 픽셀 한계가 나타납니다.",
 "A fixed 2.0 px displacement, three viewing ranges":"고정된 2.0 px 변위, 세 가지 관측 거리",
 "Estimated local ground effect in centimetres.":"센티미터 단위의 국소 지상 영향 추정값입니다.",
 "Scope.":"범위.",
 "Selected local scales for educational comparison — not a complete-system accuracy specification.":
   "교육적 비교를 위해 선택한 국소 스케일이며, 전체 시스템의 정확도 사양이 아닙니다.",

 "Selected work":"선택된 연구",
 "Case 001 · Spatial evidence":"Case 001 · 공간 증거",
 "From a surveyed primitive":"측량된 생성원에서",
 "to an auditable boundary.":"감사 가능한 경계까지.",
 "A physical geometry is established before the image enters the chain. A camera model carries the boundary into the frame; the observed response is returned to object space; the final discrepancy is audited with its sign intact.":
   "영상이 사슬에 들어오기 전에 물리적 기하가 먼저 확정됩니다. 카메라 모델이 그 경계를 화면 안으로 옮기고, 관측된 응답은 다시 물체공간으로 되돌아오며, 최종 차이는 부호를 유지한 채 감사됩니다.",
 "Field record":"현장 기록",
 "One installation. Multiple observation roles.":"하나의 설치. 여러 개의 관측 역할.",
 "Physical primitive":"물리적 생성원",
 "1.5 m nominal radius":"공칭 반경 1.5 m",
 "Generated boundary":"생성 경계",
 "5.5 m nominal radius":"공칭 반경 5.5 m",
 "Observation design":"관측 설계",
 "Public status":"공개 상태",
 "Paper under review":"논문 심사 중",

 "Who is writing this":"이 글을 쓰는 사람",
 "I work between a laboratory and an industrial yard.":"저는 실험실과 산업 현장 사이에서 일합니다.",
 "I am a Ph.D. candidate at Yonsei University, I am responsible for a steel pipe company in Seoul, and I serve as President of an engineering alumni association.":
   "저는 연세대학교 박사수료생이고, 서울에서 강관 회사를 맡고 있으며, 공학 동문회의 회장을 맡고 있습니다.",
 "I do not treat these as three separate careers. JoosAtlas is where I try to make all three answer to one standard — and where I write down the things I cannot yet claim.":
   "저는 이 셋을 별개의 경력으로 여기지 않습니다. JoosAtlas는 이 셋을 하나의 기준에 맞춰 보려는 자리이고, 아직 주장할 수 없는 것들을 적어 두는 자리입니다.",
 "Yonsei University · GIS Remote Sensing and Surveying Laboratory":"연세대학교 · GIS 원격탐사 및 측량 연구실",
 "President · Daejin Pipe Co., Ltd.":"대표이사 · 대진파이프",
 "President · ACERS":"회장 · ACERS",

 "Three worlds":"세 개의 세계",
 "One working standard across three environments.":"세 환경을 관통하는 하나의 작업 기준.",
 "Academic research, industrial operation and professional community are not separate biographies. They are mutually testing contexts.":
   "학술 연구와 산업 운영, 전문가 공동체는 각각의 이력이 아닙니다. 서로를 시험하는 맥락입니다.",
 "Research / 01":"연구 / 01","Industry / 02":"산업 / 02","Community / 03":"공동체 / 03",
 "Industrial operations, materials and field implementation.":"산업 운영, 자재, 그리고 현장 적용.",
 "Alumni of Civil, Environmental Resilience Safety":"Alumni of Civil, Environmental Resilience Safety",
 "Yonsei Graduate School of Engineering":"연세대학교 공학대학원",

 "Industrial reality":"산업의 현실",
 "Operations are spatial systems.":"운영은 공간 시스템입니다.",
 "Inventory, access, lifting, storage, safety and delivery all occupy measurable space. The operating environment is not a backdrop to JoosAtlas; it is where methods encounter consequence.":
   "재고와 진입, 양중과 보관, 안전과 배송은 모두 측정 가능한 공간을 차지합니다. 이 운영 환경은 JoosAtlas의 배경이 아니라, 방법이 결과와 마주치는 자리입니다.",
 "Operating site · aerial record":"운영 현장 · 항공 기록",

 "Personal field record":"개인 현장 기록",
 "I am also the person doing the work.":"저는 그 일을 직접 하는 사람이기도 합니다.",
 "That is me, in the workshop I also manage. I include it because it explains something about the work: handling the material changes which constraints I notice. JoosAtlas grows from that double position — measurement on one side, operational consequence on the other.":
   "제가 관리하는 작업장에서 일하는 저입니다. 이 사진을 넣은 이유는 일에 대해 설명해 주는 바가 있기 때문입니다. 재료를 직접 다루면 눈에 들어오는 제약이 달라집니다. JoosAtlas는 그 이중의 위치에서 자랍니다. 한쪽에는 측정이, 다른 한쪽에는 운영상의 결과가 있습니다.",
 "Workshop record":"작업장 기록","Seoul":"서울",

 "Current coordinates":"현재 좌표",
 "A growing atlas, labeled by evidence and maturity.":"근거와 성숙도로 이름표를 붙인, 자라나는 아틀라스.",
 "Nothing is presented as complete before its status can be stated precisely.":"상태를 정확히 말할 수 있기 전에는 어떤 것도 완성으로 내놓지 않습니다.",
 "Spatial Evidence":"공간 증거",
 "Fixed-Camera Metrology":"고정 카메라 계측",
 "Industrial Digital Twin":"산업 디지털 트윈",
 "Interactive Measurement":"인터랙티브 계측",
 "In development":"개발 중","Exploratory":"탐색 중","Planned":"계획",
 "Do not claim what the measurement chain cannot support.":"계측 사슬이 지탱하지 못하는 것은 주장하지 않는다.",
 "An independent personal research platform. Affiliations are biographical context.":
   "독립적인 개인 연구 플랫폼입니다. 소속은 이력의 맥락으로만 적었습니다.",
})

# ── Case 001 ─────────────────────────────────────────────────────────────────
add({
 "Case 001 · Paper under review":"Case 001 · 논문 심사 중",
 "Can a single oblique image test whether a field-generated design boundary has been preserved?":
   "한 장의 경사 영상만으로, 현장에서 생성한 설계 경계가 보존되었는지 검사할 수 있는가?",
 "Object-space datum":"물체공간 기준","Image geometry":"영상 기하","Signed terminal audit":"부호 있는 종단 감사",

 "A projected boundary may look correct and still fail as a measurement.":
   "투영된 경계는 맞아 보이면서도 측정으로서는 실패할 수 있습니다.",
 "Visual agreement answers a perceptual question. The paper asks a metric one.":
   "시각적 일치는 지각의 질문에 답합니다. 논문이 묻는 것은 계측의 질문입니다.",
 "The design boundary is first generated in object space from a surveyed primitive. The image is then used only as an observation channel. Its response is returned to object space and compared at the terminal quantity.":
   "설계 경계는 먼저 측량된 생성원으로부터 물체공간에서 만들어집니다. 그다음 영상은 관측 통로로만 쓰입니다. 그 응답은 다시 물체공간으로 되돌아와 최종량에서 비교됩니다.",
 "This separation prevents the image from defining the reference it is later asked to verify.":
   "이 분리는 영상이, 나중에 자신이 검증해야 할 기준을 스스로 정하는 일을 막습니다.",
 "Image question":"영상의 질문","Measurement question":"계측의 질문",
 "Does the overlay look plausible?":"겹쳐 놓은 선이 그럴듯해 보이는가?",
 "Useful for visualization, insufficient for certification.":"시각화에는 쓸모 있지만, 인증에는 부족합니다.",
 "Does the observed response preserve the object-space boundary?":"관측된 응답이 물체공간의 경계를 보존하는가?",
 "Requires an independent datum, a declared model and a terminal comparison.":
   "독립적인 기준과 선언된 모델, 그리고 최종 비교가 필요합니다.",

 "A traceable five-stage chain":"추적 가능한 다섯 단계의 사슬",
 "Each stage has one job.":"각 단계의 역할은 하나뿐입니다.",
 "No stage is allowed to validate itself.":"어떤 단계도 자기 자신을 검증할 수 없습니다.",
 "Use the numbered controls to inspect how the physical datum, the image observation and the terminal audit remain separate. Arrow keys move between stages.":
   "번호가 붙은 단추로 물리적 기준과 영상 관측, 최종 감사가 어떻게 분리되어 있는지 확인하십시오. 방향키로도 단계를 옮길 수 있습니다.",
 "Survey":"측량","Generate":"생성","Project":"투영","Return":"복귀",
 "01 / Survey":"01 / 측량","02 / Generate":"02 / 생성","03 / Project":"03 / 투영",
 "04 / Return":"04 / 복귀","05 / Audit":"05 / 감사",
 "Establish the primitive in object space.":"물체공간에 생성원을 확정합니다.",
 "TS observations estimate a common centre and primitive radius. The camera has not yet contributed to either quantity.":
   "토탈스테이션 관측으로 공통 중심과 생성원 반경을 추정합니다. 이 두 값에 카메라는 아직 아무것도 기여하지 않았습니다.",
 "Can establish":"확정할 수 있는 것","Cannot establish":"확정할 수 없는 것",
 "Physical origin and metric scale":"물리적 원점과 계측 스케일",
 "Image response or terminal conformity":"영상 응답이나 최종 적합성",
 "Create the design boundary by declared scaling.":"선언된 배율로 설계 경계를 만듭니다.",
 "The boundary radius follows from the surveyed primitive and an explicit scale factor. It is not selected by looking at the image.":
   "경계 반경은 측량된 생성원과 명시된 배율에서 나옵니다. 영상을 보고 고른 값이 아닙니다.",
 "Design radius in the same metric frame":"같은 계측 좌표계 안의 설계 반경",
 "Where an observed image response will fall":"관측된 영상 응답이 어디에 놓일지",
 "Predict an image address from known geometry.":"알려진 기하로부터 영상 주소를 예측합니다.",
 "The camera model maps a known object-space point to an expected image location. That prediction guides observation; it is not the final measurement.":
   "카메라 모델은 알려진 물체공간 점을 예상 영상 위치로 옮깁니다. 그 예측은 관측을 안내할 뿐, 최종 측정값이 아닙니다.",
 "Predicted image location under the declared model":"선언된 모델에서의 예측 영상 위치",
 "The actual response selected in the image":"영상에서 실제로 선택된 응답",
 "Back-project the selected response into object space.":"선택된 응답을 물체공간으로 역투영합니다.",
 "The observed pixel defines a ray from the camera centre. Its intersection with a declared support surface gives the reconstructed object-space location.":
   "관측된 픽셀은 카메라 중심에서 나가는 하나의 광선을 정의합니다. 선언된 지지면과의 교점이 복원된 물체공간 위치가 됩니다.",
 "A 3D point under the declared support model":"선언된 지지면 모델에서의 3차원 점",
 "Conformity before terminal comparison":"최종 비교 이전의 적합성",
 "Compare the two radii and retain direction.":"두 반경을 비교하되 방향을 남깁니다.",
 "The final discrepancy is computed only after the generated boundary and the reconstructed reference radius exist in the same object-space frame.":
   "최종 차이는 생성 경계와 복원된 기준 반경이 같은 물체공간 좌표계 안에 있게 된 뒤에만 계산됩니다.",
 "Signed terminal radial discrepancy":"부호 있는 종단 반경 차이",
 "More certainty than the preceding chain supports":"앞선 사슬이 지탱하는 것보다 큰 확신",

 "Every displayed relation carries its symbols.":"화면에 나온 모든 관계식은 기호 정의를 함께 싣습니다.",
 "Nothing below is stated without a definition for each term and, where direction matters, an explicit algebraic sign convention.":
   "아래의 어떤 식도 각 항의 정의 없이 제시하지 않았고, 방향이 중요한 곳에는 대수적 부호 규약을 명시했습니다.",
 "Surveyed primitive":"측량된 생성원",
 "Fit the physical centre and primitive radius.":"물리적 중심과 생성원 반경을 적합합니다.",
 "The measured primitive points define the datum before the camera enters the chain.":
   "측정된 생성원 점들이, 카메라가 사슬에 들어오기 전에 기준을 정의합니다.",
 "candidate primitive centre":"후보 생성원 중심",
 "candidate primitive radius":"후보 생성원 반경",
 "estimated quantity obtained from the fit":"적합으로 얻은 추정량",
 "values of centre and radius that minimise the summed squared radial residuals":
   "반경 잔차 제곱합을 최소로 만드는 중심과 반경의 값",
 "Exact generation":"정확한 생성",
 "Generate the design boundary by declared metric scaling.":"선언된 계측 배율로 설계 경계를 생성합니다.",
 "The design boundary is derived from the surveyed primitive, not selected in the image.":
   "설계 경계는 측량된 생성원에서 유도된 것이지, 영상에서 고른 것이 아닙니다.",
 "generated design-boundary radius":"생성된 설계 경계 반경",
 "declared scale factor from primitive to boundary":"생성원에서 경계로 가는 선언된 배율",
 "estimated physical primitive radius":"추정된 물리적 생성원 반경",
 "Forward projection":"전방투영",
 "Carry a known object-space point into the image.":"알려진 물체공간 점을 영상 안으로 옮깁니다.",
 "The projection predicts where known geometry should appear. The scalar":
   "이 투영은 알려진 기하가 어디에 나타나야 하는지를 예측합니다. 스칼라",
 "is used here to avoid confusing projective scale with the session index used later.":
   "는 뒤에 나오는 세션 지표와 투영 스케일을 혼동하지 않기 위해 여기서 쓴 기호입니다.",
 "object-space point in homogeneous coordinates":"동차좌표로 표현한 물체공간 점",
 "predicted image point in homogeneous pixel coordinates":"동차 픽셀좌표로 표현한 예측 영상점",
 "camera intrinsic matrix":"카메라 내부표정 행렬",
 "camera rotation and translation":"카메라 회전과 이동",
 "non-zero projective scale":"0이 아닌 투영 스케일",
 "Inverse projection":"역투영",
 "Return the selected image response to object space.":"선택된 영상 응답을 물체공간으로 되돌립니다.",
 "The pixel becomes a ray. A support surface or point height is still required to select one 3D location on that ray.":
   "픽셀은 하나의 광선이 됩니다. 그 광선 위에서 하나의 3차원 위치를 고르려면 지지면이나 점 높이가 여전히 필요합니다.",
 "camera projection centre in object space":"물체공간에서의 카메라 투영중심",
 "distance parameter along the ray":"광선을 따라가는 거리 매개변수",
 "transpose of the rotation matrix, mapping the ray back to object space":
   "회전행렬의 전치. 광선을 물체공간으로 되돌립니다",
 "inverse intrinsic mapping from pixels to a camera-frame direction":
   "픽셀을 카메라 좌표계 방향으로 되돌리는 내부표정의 역사상",
 "the selected observed image response, not merely the predicted address":
   "예측된 주소가 아니라, 실제로 선택된 관측 영상 응답",
 "Compare the generated and reconstructed radii.":"생성 반경과 복원 반경을 비교합니다.",
 "This displayed definition retains direction rather than reporting only an absolute magnitude.":
   "여기 표시한 정의는 절댓값만 보고하지 않고 방향을 유지합니다.",
 "signed radial discrepancy for session or condition":"세션 또는 조건에 대한 부호 있는 반경 차이",
 "and boundary observation":"와 경계 관측",
 "estimated generated-boundary radius for session":"세션에 대한 추정 생성 경계 반경",
 "radius recovered from the selected image response and its object-space support for observation":
   "선택된 영상 응답과 그 물체공간 지지면으로부터 복원된 반경. 관측",
 "generated boundary":"생성 경계",
 "reconstructed reference response":"복원된 기준 응답",
 "Algebraic sign of the displayed definition":"표시된 정의의 대수적 부호",
 "The reconstructed reference lies at a smaller radius than the generated boundary — radially inward, provided both use the same origin.":
   "복원된 기준이 생성 경계보다 작은 반경에 놓입니다. 두 값이 같은 원점을 쓴다면 반경 방향으로 안쪽입니다.",
 "The two radii coincide.":"두 반경이 일치합니다.",
 "The reconstructed reference lies at a larger radius than the generated boundary — radially outward.":
   "복원된 기준이 생성 경계보다 큰 반경에 놓입니다. 반경 방향으로 바깥쪽입니다.",
 "This interpretation follows the equation shown above. If the final manuscript reverses the subtraction order, the sign labels must also reverse; the website must match the accepted manuscript exactly.":
   "이 해석은 위에 표시한 식을 따릅니다. 최종 원고에서 뺄셈 순서가 뒤집히면 부호 표시도 함께 뒤집어야 합니다. 이 웹사이트는 게재가 확정된 원고와 정확히 일치해야 합니다.",

 "Field realization":"현장 구현",
 "The geometry existed before it became a figure.":"그 기하는 그림이 되기 전에 이미 존재했습니다.",
 "The installation combines a surveyed datum, a physical primitive, an exact generated boundary, camera stations and independent TS references.":
   "이 설치는 측량된 기준과 물리적 생성원, 정확히 생성된 경계, 카메라 스테이션, 그리고 독립적인 TS 기준점을 함께 둡니다.",
 "Field configuration":"현장 구성","Metric and visual viewpoints":"계측적 시점과 시각적 시점",
 "Physical datum":"물리적 기준",
 "The origin and primitive are surveyed independently of the image.":"원점과 생성원은 영상과 무관하게 측량됩니다.",
 "Multiple placements":"여러 배치",
 "Central, lateral and depth-displaced arrangements test different viewing geometry.":
   "중앙, 측방, 깊이 방향으로 옮긴 배치가 서로 다른 관측 기하를 시험합니다.",
 "Multiple distances":"여러 거리",
 "Increasing range changes projected observability and inverse sensitivity.":
   "거리가 멀어지면 투영된 관측가능성과 역방향 감도가 함께 달라집니다.",
 "Independent references":"독립 기준점",
 "Selected TS boundary points challenge the generated geometry in object space.":
   "선택된 TS 경계점이 물체공간에서 생성된 기하를 검증합니다.",
 "The complete observation accounting remains in the manuscript and its supporting package.":
   "전체 관측 내역은 원고와 그 보조 자료에 남아 있습니다.",

 "Interactive lab":"인터랙티브 실험실",
 "Local sensitivity — not global accuracy":"국소 감도 — 전역 정확도가 아님",
 "Find the largest image displacement that keeps the local ground effect below 5 cm.":
   "국소 지상 영향을 5 cm 아래로 유지하는 가장 큰 영상 변위를 찾아보십시오.",
 "Adjust the pixel displacement. The calculation, the rulers and the curve below all use the same explicit relation, so no readout can disagree with another.":
   "픽셀 변위를 조정해 보십시오. 계산과 두 자, 그리고 아래 곡선이 모두 같은 관계식을 쓰기 때문에 어떤 표시값도 서로 어긋날 수 없습니다.",
 "Viewing range":"관측 거리","Image displacement":"영상 변위",
 "Image plane":"영상면","Local ground effect":"국소 지상 영향",
 "Selected local scale":"선택된 국소 스케일","Local scale":"국소 스케일",
 "5 cm pixel limit":"5 cm 픽셀 한계","Computed effect":"계산된 영향",
 "Selected displacement from the predicted image address.":"예측된 영상 주소로부터의 선택 변위입니다.",
 "The red line is the 5 cm challenge threshold; the fill is the computed effect.":
   "붉은 선이 5 cm 기준선이고, 채워진 부분이 계산된 영향입니다.",
 "image displacement in pixels":"픽셀 단위의 영상 변위",
 "selected local inverse-Jacobian scale in mm/px":"mm/px 단위로 선택한 국소 역야코비안 스케일",
 "estimated local ground effect in centimetres":"센티미터 단위의 국소 지상 영향 추정값",
 "JavaScript is disabled":"JavaScript가 꺼져 있습니다",
 "The static default is 7 m and 1.50 px: 1.50 × 27.815 ÷ 10 = 4.17 cm, which is below 5 cm. The 5 cm pixel limits are 1.798 px at 7 m, 1.217 px at 9 m and 0.809 px at 12 m.":
   "정적 기본값은 7 m, 1.50 px입니다. 1.50 × 27.815 ÷ 10 = 4.17 cm 로 5 cm 아래입니다. 5 cm 픽셀 한계는 7 m에서 1.798 px, 9 m에서 1.217 px, 12 m에서 0.809 px 입니다.",

 "Ground effect against image displacement":"영상 변위에 따른 지상 영향",
 "Each line applies":"각 선은",
 "at one selected local scale. The marked dot on each line is where that range crosses 5 cm; the gold marker follows the lab above.":
   "를 하나의 선택된 국소 스케일에 적용한 것입니다. 각 선 위의 점은 그 거리가 5 cm를 지나는 지점이고, 금색 표식은 위 실험실을 따라 움직입니다.",
 "5 cm limit":"5 cm 한계",
 "Local ground effect in centimetres by image displacement":"영상 변위에 따른 센티미터 단위 국소 지상 영향",
 "The three scales — 27.815, 41.079 and 61.782 mm/px — are selected local inverse-Jacobian values for educational comparison. They are not a global accuracy specification for the complete measurement chain.":
   "세 스케일 27.815, 41.079, 61.782 mm/px 는 교육적 비교를 위해 선택한 국소 역야코비안 값입니다. 전체 계측 사슬의 전역 정확도 사양이 아닙니다.",

 "Observation geometry":"관측 기하",
 "Plan view · local frame":"평면도 · 국소 좌표계",
 "Three placements around one surveyed origin.":"측량된 하나의 원점을 둘러싼 세 개의 배치.",
 "The plot is drawn directly from the disclosed summary: the estimated origin, the nominal primitive and generated-boundary radii, and each condition’s local camera vector with its viewing axis. Hover a station for its range and azimuth.":
   "이 그림은 공개된 요약값에서 직접 그렸습니다. 추정 원점, 공칭 생성원과 생성 경계의 반경, 그리고 각 조건의 국소 카메라 벡터와 관측 축입니다. 스테이션에 마우스를 올리면 거리와 방위각이 나타납니다.",
 "Camera placements in the local N–E frame":"국소 N–E 좌표계에서의 카메라 배치",
 "North up, East right. Rings mark 5 m and 10 m from the estimated origin.":
   "위쪽이 북, 오른쪽이 동입니다. 원은 추정 원점에서 5 m와 10 m를 표시합니다.",
 "C3 · central":"C3 · 중앙","R3 · lateral":"R3 · 측방","D3 · depth":"D3 · 깊이",
 "5.5 m boundary":"5.5 m 경계","Reading.":"읽는 법.",
 "Each dashed line and shaded wedge shows the disclosed viewing axis pointing back to the estimated origin. This is the disclosed observation summary, not a complete site survey.":
   "점선과 음영 부채꼴은 공개된 관측 축이 추정 원점을 향하는 방향을 나타냅니다. 이는 공개된 관측 요약이며 현장 전체의 측량 성과가 아닙니다.",
 "Disclosed local geometry per condition":"조건별 공개 국소 기하",
 "Condition":"조건","Range (m)":"거리 (m)","Azimuth":"방위각",
 "Origin":"원점",
 "Estimated at N 97.4695 m, E 75.4718 m in the working local frame (mean of the three conditions).":
   "작업 국소 좌표계에서 N 97.4695 m, E 75.4718 m 로 추정했습니다 (세 조건의 평균).",
 "Primitive":"생성원",
 "1.5 m nominal radius, surveyed before the image enters the chain.":
   "공칭 반경 1.5 m. 영상이 사슬에 들어오기 전에 측량했습니다.",
 "Boundary":"경계",
 "5.5 m nominal radius, generated by the declared factor λ = 11/3.":
   "공칭 반경 5.5 m. 선언된 배율 λ = 11/3 로 생성했습니다.",
 "Viewing axis":"관측 축",
 "Each condition’s far axis points from the camera back toward the estimated origin.":
   "각 조건의 far 축은 카메라에서 추정 원점을 향합니다.",

 "Selected evidence":"선택된 증거",
 "Object-space validation":"물체공간 검증",
 "Three placements. Two views. One metric frame.":"세 개의 배치. 두 개의 시점. 하나의 계측 좌표계.",
 "The explorer below shows selected TS boundary checks only. It does not substitute for the full terminal image audit.":
   "아래 탐색기는 선택된 TS 경계 검사만 보여줍니다. 전체 종단 영상 감사를 대신하지 않습니다.",
 "C3 · Central":"C3 · 중앙","R3 · Lateral":"R3 · 측방","D3 · Depth":"D3 · 깊이",
 "Plan":"평면","Placement":"배치",
 "Central placement with the densest selected boundary support among the three examples.":
   "세 예시 가운데 선택된 경계 지지점이 가장 조밀한 중앙 배치입니다.",
 "RMSE":"RMSE","Mean error":"평균 오차","Max |error|":"최대 |오차|",
 "Boundary points":"경계점 수","Point range":"점 번호 범위",
 "These values describe selected TS boundary references in the GoPro-view-aligned metric frame. They are not the image-derived terminal result.":
   "이 값들은 GoPro 시점에 정렬된 계측 좌표계에서의 선택된 TS 경계 기준점을 기술합니다. 영상에서 유도한 종단 결과가 아닙니다.",

 "Residual profile of the selected TS boundary checks":"선택된 TS 경계 검사의 잔차 프로파일",
 "For each condition: the dot is the mean error (bias), the band is ±RMSE (dispersion), and the whisker is the ±max |error| envelope containing every selected point.":
   "각 조건에서 점은 평균 오차(편향), 띠는 ±RMSE(산포), 수염은 선택된 모든 점을 담는 ±최대 |오차| 포락선입니다.",
 "C3 · 17 points":"C3 · 17점","R3 · 16 points":"R3 · 16점","D3 · 8 points":"D3 · 8점",
 "Selected TS boundary residuals, in millimetres":"선택된 TS 경계 잔차 (밀리미터)",
 "All three means sit close to zero, so the disagreement is dispersion rather than a large systematic offset in these examples. Support density falls from 17 to 8 points as dispersion grows.":
   "세 평균이 모두 0에 가깝습니다. 따라서 이 예시들에서의 불일치는 큰 계통 편차가 아니라 산포입니다. 산포가 커질수록 지지점 수는 17개에서 8개로 줄어듭니다.",

 "Interpretation":"해석",
 "What the selected object-space checks do — and do not — establish.":
   "선택된 물체공간 검사가 확정하는 것과 확정하지 못하는 것.",
 "Supported":"지지됨","Varies by geometry":"기하에 따라 달라짐","Not the endpoint":"종착점이 아님",
 "The generated boundary is physically testable.":"생성된 경계는 물리적으로 검사 가능합니다.",
 "The selected TS references lie around the nominal boundary with millimetre-scale radial residuals in these examples.":
   "이 예시들에서 선택된 TS 기준점은 공칭 경계 주위에 밀리미터 규모의 반경 잔차로 놓입니다.",
 "Placement changes support and fit.":"배치가 지지점과 적합도를 바꿉니다.",
 "C3 is the densest and smallest-RMSE example; D3 contains fewer selected points and the largest RMSE.":
   "C3는 가장 조밀하고 RMSE가 가장 작은 예시이고, D3는 선택된 점이 적고 RMSE가 가장 큽니다.",
 "Object-space validation is not the image audit.":"물체공간 검증은 영상 감사가 아닙니다.",
 "The figures verify the generated boundary, not the complete image response, back-projection and signed terminal discrepancy.":
   "이 그림들은 생성된 경계를 검증할 뿐, 전체 영상 응답과 역투영, 부호 있는 종단 차이를 검증하지는 않습니다.",

 "Claim boundary":"주장의 경계",
 "A credible result includes the limits of what it can say.":"믿을 수 있는 결과는 자신이 말할 수 있는 한계까지 포함합니다.",
 "Supported here":"여기서 지지되는 것","Not claimed here":"여기서 주장하지 않는 것",
 "The physical datum and surveyed primitive precede the image.":"물리적 기준과 측량된 생성원이 영상보다 앞섭니다.",
 "Exact metric scaling generates the design boundary.":"정확한 계측 배율이 설계 경계를 생성합니다.",
 "Selected TS points independently check the object-space boundary.":"선택된 TS 점이 물체공간 경계를 독립적으로 검사합니다.",
 "Projection and back-projection are explicitly connected.":"투영과 역투영이 명시적으로 연결되어 있습니다.",
 "The terminal difference preserves sign.":"최종 차이가 부호를 보존합니다.",
 "Identical performance for arbitrary cameras or sites.":"임의의 카메라나 현장에서 동일한 성능.",
 "A complete GUM uncertainty statement.":"완결된 GUM 불확도 진술.",
 "The full 27-condition image-audit result.":"27개 조건 전체의 영상 감사 결과.",
 "Public release of raw coordinates, calibration files or reviewer correspondence.":
   "원좌표, 캘리브레이션 파일, 심사 서신의 공개.",
 "That an unverified case is equivalent to zero error.":"검증되지 않은 경우가 오차 0과 같다는 주장.",

 "Release ledger":"공개 원장",
 "Public explanation now.":"설명은 지금 공개합니다.",
 "Complete evidence with the paper.":"완전한 근거는 논문과 함께.",
 "The current site exposes the research question, selected theory, field realization and limited object-space checks. The full method, terminal results and reproducibility package remain tied to the manuscript’s release status.":
   "현재 사이트는 연구 질문과 선택된 이론, 현장 구현, 그리고 제한된 물체공간 검사를 공개합니다. 전체 방법과 종단 결과, 재현 자료는 원고의 공개 상태에 묶여 있습니다.",
 "Research question":"연구 질문","Core theoretical chain":"핵심 이론 사슬",
 "Selected object-space evidence":"선택된 물체공간 증거",
 "Full terminal image audit":"전체 종단 영상 감사",
 "Raw data and implementation":"원자료와 구현",
 "Paper":"논문","Released":"공개","Withheld":"비공개","Under review":"심사 중",
 "Case 001 · Paper under review. Selected evidence only; raw data and the full audit remain withheld.":
   "Case 001 · 논문 심사 중. 선택된 증거만 공개하며, 원자료와 전체 감사는 비공개입니다.",
})

# ── About ────────────────────────────────────────────────────────────────────
add({
 "This page is a plain account of what I do, not a list of things I have achieved.":
   "이 페이지는 제가 하는 일에 대한 담담한 기록입니다. 이룬 것의 목록이 아닙니다.",
 "I am a Ph.D. candidate at Yonsei University, I am responsible for a steel pipe company in Seoul, and I serve as President of an engineering alumni association. I do not treat these as three separate careers. Each one keeps checking the other, and that is most of what I have to say for myself.":
   "저는 연세대학교 박사수료생이고, 서울에서 강관 회사를 맡고 있으며, 공학 동문회의 회장을 맡고 있습니다. 저는 이 셋을 별개의 경력으로 여기지 않습니다. 각각이 서로를 계속 점검합니다. 제가 저에 대해 할 말은 대체로 그것이 전부입니다.",
 "Yonsei University":"연세대학교",
 "I start from something physical.":"저는 물리적인 것에서 시작합니다.",
 "My question is narrow: can surveying, photogrammetry and computer vision be connected so that no single observation is allowed to validate itself?":
   "제 질문은 좁습니다. 측량과 사진측량, 컴퓨터 비전을 잇되 어떤 관측도 자기 자신을 검증하지 못하게 만들 수 있는가?",
 "I am a Ph.D. candidate in the School of Civil & Environmental Engineering at Yonsei University, working in the GIS Remote Sensing and Surveying Laboratory.":
   "저는 연세대학교 건설환경공학부 박사수료생이며, GIS 원격탐사 및 측량 연구실에서 연구하고 있습니다.",
 "I do not have a finished answer. Case 001 is where the current attempt is visible, including the parts I cannot yet claim and the data I am not releasing while the paper is under review.":
   "저에게 완결된 답은 없습니다. Case 001은 지금까지의 시도가 드러나 있는 자리입니다. 아직 주장할 수 없는 부분과, 논문이 심사 중인 동안 공개하지 않는 자료까지 함께 적었습니다.",
 "Field datum":"현장 기준","Instrument record":"장비 기록",
 "Institution":"소속","School":"학부","Laboratory":"연구실",
 "Civil & Environmental Engineering":"건설환경공학부",
 "GIS Remote Sensing and Surveying":"GIS 원격탐사 및 측량",
 "GIS Remote Sensing and Surveying Laboratory":"GIS 원격탐사 및 측량 연구실",
 "School of Civil & Environmental Engineering":"건설환경공학부",
 "Ph.D. candidate":"박사수료","Ph.D. Candidate":"박사수료",
 "Current work":"현재 연구","Case 001 — paper under review":"Case 001 — 논문 심사 중",

 "02 / Workshop":"02 / 작업장",
 "The welding photograph is me.":"용접하는 사진은 저입니다.",
 "I include it not to make a point about myself, but because it explains something about the work. I manage that workshop and I also work in it. Doing so changes which constraints I notice: material, access, heat, time and safety stop being variables on a page once you have handled them.":
   "제 자랑을 하려고 넣은 것이 아니라, 일에 대해 설명해 주는 바가 있어서 넣었습니다. 저는 그 작업장을 관리하고, 동시에 그 안에서 일합니다. 그렇게 하면 눈에 들어오는 제약이 달라집니다. 재료와 진입, 열과 시간과 안전은 직접 다뤄 본 뒤에는 종이 위의 변수이기를 그칩니다.",
 "The same standard should survive the paper, the field and the operating decision.":
   "같은 기준이 논문에서도, 현장에서도, 운영상의 결정에서도 살아남아야 합니다.",

 "Daejin Pipe is where a method meets its consequence.":"대진파이프는 방법이 그 결과와 만나는 자리입니다.",
 "I am responsible for Daejin Pipe Co., Ltd., which supplies steel pipe and mechanical fire-protection materials.":
   "저는 강관과 소방 기계설비 자재를 공급하는 대진파이프를 맡고 있습니다.",
 "Handling, fabrication, inventory, logistics, safety and customer response make an environment where a method either stays useful or quietly stops being used. I have watched several stop. That is the part of the job that keeps my research honest.":
   "취급과 가공, 재고와 물류, 안전과 고객 대응이 하나의 환경을 만듭니다. 그 안에서 어떤 방법은 계속 쓰이고, 어떤 방법은 조용히 쓰이지 않게 됩니다. 저는 몇 가지가 그렇게 사라지는 것을 보았습니다. 제 연구를 정직하게 붙들어 두는 것이 바로 그 부분입니다.",
 "Company front":"회사 전경","Daejin Pipe Co., Ltd.":"대진파이프",
 "Operating site":"운영 현장","Inventory · access · logistics":"재고 · 진입 · 물류",
 "Role":"직위","President":"대표이사","Materials":"자재","Location":"소재지",
 "Steel pipe and mechanical fire protection":"강관 및 소방 기계설비",
 "Seoul, Republic of Korea":"대한민국 서울",

 "Most of what I know arrived through other people.":"제가 아는 것의 대부분은 다른 사람을 통해 왔습니다.",
 "I serve as President of ACERS — Alumni of Civil, Environmental Resilience Safety, at the Yonsei Graduate School of Engineering.":
   "저는 연세대학교 공학대학원의 ACERS — Alumni of Civil, Environmental Resilience Safety 회장을 맡고 있습니다.",
 "The role is mostly organising, listening and keeping people in touch with one another. It is unglamorous and it is the reason several of the questions on this site exist at all.":
   "이 역할의 대부분은 자리를 만들고, 듣고, 사람들이 서로 이어져 있게 하는 일입니다. 화려하지 않지만, 이 사이트에 있는 질문 몇 개는 그 덕분에 생겼습니다.",
 "ACERS gathering":"ACERS 모임","Organisation":"조직","Full name":"정식 명칭","Affiliation":"소속",

 "How I try to work":"제가 일하려고 하는 방식",
 "Four things, in this order.":"네 가지를, 이 순서로.",
 "I do not always manage all four. The last one is the hardest and the one I care most about getting right.":
   "네 가지를 늘 지키지는 못합니다. 마지막 것이 가장 어렵고, 제가 가장 제대로 하고 싶은 것입니다.",
 "Separate what I have seen from what I have assumed.":"본 것과 가정한 것을 분리합니다.",
 "Measure":"측정한다",
 "Anchor the question to a physical or operational reference.":"질문을 물리적 또는 운영상의 기준에 붙들어 맵니다.",
 "Build":"만든다",
 "Turn the method into an explanation, a tool or a system someone else can use.":
   "방법을 다른 사람이 쓸 수 있는 설명이나 도구, 시스템으로 만듭니다.",
 "Refuse":"거절한다",
 "Withhold the claims the evidence chain cannot support, including my own.":
   "근거의 사슬이 지탱하지 못하는 주장은 보류합니다. 제 주장도 포함해서입니다.",

 "If any of this is useful to you, write to me.":"이 중에 쓸모 있는 것이 있다면, 메일 주십시오.",
 "I read both addresses. Questions about the method, the data boundary or the review status are welcome, and so is a correction.":
   "두 주소 모두 읽습니다. 방법이나 자료의 공개 범위, 심사 상태에 대한 질문을 환영합니다. 정정도 마찬가지입니다.",
 "Affiliations on this page are biographical context. JoosAtlas is an independent personal platform and does not speak for Yonsei University, Daejin Pipe Co., Ltd. or ACERS.":
   "이 페이지의 소속은 이력의 맥락입니다. JoosAtlas는 독립적인 개인 플랫폼이며 연세대학교, 대진파이프, ACERS를 대변하지 않습니다.",
})

# ── 404 ──────────────────────────────────────────────────────────────────────
add({
 "Off the atlas":"아틀라스 바깥",
 "This coordinate does not exist.":"이 좌표는 존재하지 않습니다.",
 "The page you requested is not part of the published atlas. Nothing is presented here before its status can be stated precisely — including its URL.":
   "요청하신 페이지는 공개된 아틀라스에 없습니다. 이곳에서는 상태를 정확히 말할 수 있기 전에는 어떤 것도 내놓지 않습니다. 주소도 마찬가지입니다.",
 "A plain account of the work":"일에 대한 담담한 기록",
})

# ── v12 Library: chrome and palette (page copy carries data-ko in the HTML) ──
add({
 "Library":"자료실",
 "Field Manual 001":"현장 교재 001",
 "Film 001":"영상 001",
 "Shelf":"목록",
 "Labels":"이름표",
 "Film":"영상",
 "Scenes":"장면",
 "Claims":"주장",
 "Credits":"출처",
 "26 November 2026":"2026년 11월 26일",
 "Research · manuals · films":"연구 · 교재 · 영상",
 "Field library":"현장 자료",
 "Some questions arrive across a pipe counter":"어떤 질문은 파이프 가게 계산대를 건너옵니다",
 "Library — the whole shelf":"자료실 — 선반 전체",
 "Research, field manuals and films, each with its status":"연구, 현장 교재, 영상과 각각의 상태",
 "How entries are labeled":"이름표 읽는 법",
 "Open · under review · in development · planned":"공개 · 심사 중 · 개발 중 · 계획",
 "Film 001 — scenes":"영상 001 — 장면",
 "Choose a scene and the film starts there":"장면을 누르면 그 지점부터 재생합니다",
 "Film 001 — claims and sources":"영상 001 — 주장과 근거",
 "What the film states, set against public sources":"영상이 말하는 것을 공개 근거 옆에",
 "Film 001 — credits":"영상 001 — 출처",
 "Format, production and where the file came from":"형식, 제작 방식, 파일의 출처",
 "Go to":"이동",
 "Display":"표시",
 "Action":"동작",
 "External":"외부",
 "Library — JoosAtlas":"자료실 — JoosAtlas",
 "Film 001 — Sparks · JoosAtlas":"영상 001 — 불티 · JoosAtlas",
 "Research cases, field manuals and films on JoosAtlas, each labeled by what it is, what language it is in and how far it has been checked.":"JoosAtlas의 연구 사례, 현장 교재, 영상. 항목마다 무엇인지, 어떤 언어인지, 어디까지 확인했는지를 적었습니다.",
 "A two-minute film on how hot-work sparks become construction-site fires, with each of its statements set against a public source.":"화기작업의 불티가 공사장 화재가 되는 과정을 담은 2분 영상. 영상의 주장마다 공개 근거를 나란히 놓았습니다.",
})

# ── v12.1 Thesis: chrome and palette ──
add({
 "Master's thesis":"석사논문",
 "Problem":"문제",
 "Idea":"착상",
 "Data":"데이터",
 "Findings":"결과",
 "Limits":"한계",
 "Master's thesis — the problem":"석사논문 — 문제",
 "Why welding sparks start construction-site fires":"용접 불티가 왜 공사장 화재가 되는가",
 "Master's thesis — the idea":"석사논문 — 착상",
 "Three classes: Fire, Welding, Engineer":"클래스 세 개: Fire, Welding, Engineer",
 "Master's thesis — the labels":"석사논문 — 라벨",
 "What went wrong first, and what fixed it":"처음에 틀렸던 것과, 그것을 고친 것",
 "Master's thesis — results":"석사논문 — 결과",
 "Eight models, one finding":"모델 여덟 개, 결론 하나",
 "Master's thesis — limits":"석사논문 — 한계",
 "What the thesis does not show":"이 논문이 보여 주지 않는 것",
 "Film 001 — figures and sources":"영상 001 — 수치와 근거",
 "Master's thesis, read plainly — JoosAtlas":"석사논문, 풀어서 읽기 — JoosAtlas",
 "Yonghoe JOO's master's thesis read in plain language: a YOLOv5 detector that tells welding sparks from fire on construction sites, what went wrong with the first labels, and what the results do and do not show.":"주용회의 석사논문을 풀어서 읽습니다. 건설현장에서 용접 불꽃과 화재를 구분하는 YOLOv5 탐지기, 처음 라벨에서 틀렸던 것, 그리고 결과가 말하는 것과 말하지 않는 것.",
})

# ── Attributes ───────────────────────────────────────────────────────────────
ATTR = {
 "JoosAtlas home":"JoosAtlas 홈",
 "Primary":"주요 메뉴",
 "Open command palette":"명령 팔레트 열기",
 "Toggle light or dark theme":"밝은 테마와 어두운 테마 전환",
 "Toggle navigation":"메뉴 열고 닫기",
 "Search JoosAtlas":"JoosAtlas 검색",
 "Search sections, figures and actions…":"섹션, 그림, 동작 검색…",
 "Command palette":"명령 팔레트",
 "Results":"검색 결과",
 "Measurement-chain stages":"계측 사슬 단계",
 "Viewing range":"관측 거리",
 "Image displacement in pixels":"픽셀 단위 영상 변위",
 "Placement":"배치",
 "View":"시점",
 "Expanded figure":"확대된 그림",
 "Expanded research figure":"확대된 연구 그림",
 "Open Case 001":"Case 001 열기",
 "Circle fit by least squares of radial residuals":"반경 잔차 최소제곱에 의한 원 적합",
 "Boundary radius equals lambda times the estimated primitive radius":"경계 반경은 람다 곱하기 추정 생성원 반경",
 "Projective camera equation":"투영 카메라 방정식",
 "Back projection ray equation":"역투영 광선 방정식",
 "Signed radial difference equation":"부호 있는 반경 차이 방정식",
 "A total station installed over a surveyed circular primitive in an industrial field site.":
   "산업 현장에서 측량된 원형 생성원 위에 설치된 토탈스테이션.",
 "A total station installed within the surveyed primitive at the field site.":
   "현장의 측량된 생성원 안에 설치된 토탈스테이션.",
 "A total station set up above a marked field datum.":"표시된 현장 기준점 위에 세운 토탈스테이션.",
 "Close view of a Leica total station positioned above a marked field datum.":
   "표시된 현장 기준점 위에 놓인 라이카 토탈스테이션 근접 촬영.",
 "Composite figure showing field geometry, camera placements and overhead photographs.":
   "현장 기하와 카메라 배치, 상공 촬영을 함께 보여주는 합성 그림.",
 "Composite figure showing camera placements, boundary geometry, field markers and overhead views.":
   "카메라 배치와 경계 기하, 현장 표지, 상공 시점을 함께 보여주는 합성 그림.",
 "C3 plan-view TS boundary validation.":"C3 평면 시점 TS 경계 검증.",
 "Yonghoe JOO speaking at a lectern bearing the Yonsei University emblem.":
   "연세대학교 엠블럼이 있는 연단에서 발표하는 주용회.",
 "Yonghoe JOO welding in an industrial workshop.":"산업 작업장에서 용접하는 주용회.",
 "Front view of Daejin Pipe Co., Ltd. and its operating yard.":"대진파이프 전경과 야적장.",
 "Aerial view of Daejin Pipe Co., Ltd., pipe inventory and surrounding urban infrastructure.":
   "대진파이프와 강관 재고, 주변 도시 기반시설의 항공 시점.",
 "Aerial view of the Daejin Pipe site and surrounding infrastructure.":
   "대진파이프 현장과 주변 기반시설의 항공 시점.",
 "ACERS alumni and professional community at a Yonsei Graduate School of Engineering event.":
   "연세대학교 공학대학원 행사에 모인 ACERS 동문과 전문가 공동체.",
 "ACERS alumni gathered at a Yonsei Graduate School of Engineering event.":
   "연세대학교 공학대학원 행사에 모인 ACERS 동문들.",
 "This coordinate does not exist in JoosAtlas.":"이 좌표는 JoosAtlas에 존재하지 않습니다.",
}

add({
 "Points":"점 수",
 "Sensitivity lab":"감도 실험실",
 "1.50 px × 27.815 mm/px = 41.72 mm":"1.50 px × 27.815 mm/px = 41.72 mm",
})

ATTR.update({
 "JoosAtlas — Research that survives contact with the field":"JoosAtlas — 현장을 견디는 연구",
 "JoosAtlas is the independent research platform of Yonghoe JOO (주용회), connecting surveying, photogrammetry, computer vision, industrial operation and professional community.":
   "JoosAtlas는 주용회의 독립 연구 플랫폼으로, 측량과 사진측량, 컴퓨터 비전, 산업 운영, 전문가 공동체를 잇습니다.",
 "A public record of how spatial evidence moves between surveying, image geometry, industrial reality and accountable explanation.":
   "공간 증거가 측량과 영상 기하, 산업 현실과 책임 있는 설명 사이를 어떻게 오가는지에 대한 공개 기록.",
 "Case 001 — From a surveyed primitive to an auditable boundary":"Case 001 — 측량된 생성원에서 감사 가능한 경계까지",
 "A public research experience explaining how surveyed object-space geometry, image projection and signed audit form a traceable measurement chain.":
   "측량된 물체공간 기하와 영상 투영, 부호 있는 감사가 어떻게 추적 가능한 계측 사슬을 이루는지 설명하는 공개 연구 페이지.",
 "Theory, field realization, an interactive sensitivity lab and selected object-space evidence.":
   "이론과 현장 구현, 인터랙티브 감도 실험실, 그리고 선택된 물체공간 증거.",
 "Yonghoe JOO — About":"주용회 — 소개",
 "Yonghoe JOO (주용회): Ph.D. candidate at Yonsei University, responsible for Daejin Pipe Co., Ltd., and President of ACERS. A plain account of the work.":
   "주용회: 연세대학교 박사수료, 대진파이프 대표이사, ACERS 회장. 일에 대한 담담한 기록.",
 "I work between a laboratory and an industrial yard. A plain account of what I do and what I am still working on.":
   "저는 실험실과 산업 현장 사이에서 일합니다. 제가 하는 일과 아직 붙들고 있는 일에 대한 담담한 기록.",
})

add({
 "Updated":"갱신",
 "7 August 2026":"2026년 8월 7일",
 "JoosAtlas · Field proof 001":"JoosAtlas · 현장 검증 001",
 "Local frame N 97.4695 · E 75.4718 m":"국소 좌표 N 97.4695 · E 75.4718 m",
 "Scale factor λ = 11/3":"배율 λ = 11/3",
 "Research principle":"연구 원칙",
 "Everything on this site is placed on one side of that sentence or the other.":
   "이 사이트의 모든 것은 그 문장의 어느 한쪽에 놓입니다.",
})

ATTR.update({
 "Switch language / 언어 전환":"언어 전환 / Switch language",
})

add({
 "L 한국어 / EN":"L 한국어 / EN",
})

# Placement notes held in the JS data table (only C3's appears in the HTML).
add({
 "Lateral placement with broad angular coverage and intermediate radial fit among the selected examples.":
   "선택된 예시 가운데 각도 범위가 넓고 반경 적합도가 중간인 측방 배치입니다.",
 "Depth placement with fewer selected boundary references and the largest RMSE of the three examples.":
   "선택된 경계 기준점이 적고 세 예시 중 RMSE가 가장 큰 깊이 배치입니다.",
})

# Diagram labels drawn inside the method-explorer SVGs and the charts.
add({
 "TS OBSERVATIONS → CENTRE + RADIUS":"TS 관측 → 중심 + 반경",
 "PRIMITIVE 1.5 m → BOUNDARY 5.5 m":"생성원 1.5 m → 경계 5.5 m",
 "IMAGE PLANE":"영상면",
 "SUPPORT SURFACE":"지지면",
 "Yonghoe JOO · JoosAtlas v11.0":"주용회 · JoosAtlas v11.0",
})
RUNTIME_EXTRA = {
 "5.5 m GENERATED BOUNDARY":"5.5 m 생성 경계",
 "1.5 m PRIMITIVE":"1.5 m 생성원",
 "pts":"점",
 "Central":"중앙","Lateral":"측방","Depth":"깊이",
}

# Strings that are deliberately identical in both languages (numbers, symbols,
# proper nouns, code, addresses) — listed so the coverage check stays honest.
PASSTHROUGH = set("""
JoosAtlas ACERS RMSE HOME LAB TOOLS WHO ESC 3D Plan C3 R3 D3 K R O P B C T
Yonghoe JOO YONGHOE JOO 주용회 Seoul html g m p q r s b i j
daejinpipero@gmail.com daejinpipero@yonsei.ac.kr
github.com/daejinpipero-gaja/JoosAtlas
Daejin Pipe Co., Ltd. Yonsei University
Alumni of Civil, Environmental Resilience Safety
""".split("\n"))

def is_passthrough(s):
    if re.fullmatch(r'[\s\d.,:;·×÷–—/%()\[\]+\-−°=<>|↗↑↓✓✕≠⌘…]*', s): return True
    # pure numeric/unit readouts, symbols, single glyphs
    if re.fullmatch(r'[-−+0-9.,]+\s*(px|cm|mm|m|mm/px|°)?', s): return True
    if len(s) <= 2: return True
    if s in ('HOME','WHO','LAB','TOOLS','html','한국어','EN','· v11.0','L 한국어 / EN'): return True
    if re.fullmatch(r'(q ũ = K \[R \| t\] X̃|X\(μ\) = C \+ μ Rᵀ K⁻¹ ũ|ΔR = R̂ b,s − R̂ ref,sj   \(SIGN RETAINED\)|λ = 11/3|ũ|X̃|ũ obs|ΔR)', s): return True
    if s.startswith('UTC '): return True
    if re.fullmatch(r'[0-9]+(\.[0-9]+)?\s*(px|cm|mm|m|mm/px)\s*·?.*', s) and len(s) < 26: return True
    if s in ('C · R · D / 7 · 9 · 12 m','TS0038–TS0054','TS0051–TS0058','TS0091–TS0106',
             'N (m)','E (m)','arg min','R, t','ref','ref,sj','b,s','sj','ΔR','λ','μ','ũ','X̃','r̂','R̂','ˆ',
             'g = p × m ÷ 10','p × m','at 7 m','the','th surveyed primitive point','©',
             '✓  WITHIN 5 CM','⌘K','< R̂','= R̂','> R̂','Yonghoe JOO · JoosAtlas v10.1',
             'daejinpipero@gmail.com','daejinpipero@yonsei.ac.kr','github.com/daejinpipero-gaja/JoosAtlas',
             'Daejin Pipe Co., Ltd.','Yonsei University','Alumni of Civil, Environmental Resilience Safety',
             'ACERS','JoosAtlas','Yonghoe JOO','YONGHOE JOO','주용회','Seoul','Case 001','RMSE',
             '5 cm pixel limit','12 m · 61.782 mm/px','9 m · 41.079 mm/px','7 m · 27.815 mm/px',
             'C3 · Central','R3 · Lateral','D3 · Depth'):
        return True
    return False

# ── Verify coverage ──────────────────────────────────────────────────────────
data = json.load(open('strings.json'))
missing_text = [s for s in data['text']
                if not s.startswith('=====') and s not in KR and not is_passthrough(s)]
missing_attr = [s for s in data['attrs'] if s not in ATTR and s not in KR and not is_passthrough(s)]

if missing_text or missing_attr:
    print(f'MISSING {len(missing_text)} text + {len(missing_attr)} attribute strings:')
    for s in missing_text[:60]: print('  T:', s[:120])
    for s in missing_attr[:20]: print('  A:', s[:120])
    sys.exit(1)

extra = [k for k in KR if k not in data['text'] and k not in data['attrs']]
print(f'coverage OK — {len(KR)} text entries, {len(ATTR)} attribute entries')
if extra:
    print(f'note: {len(extra)} dictionary entries not currently on a page (kept for future use)')

# ── Emit ─────────────────────────────────────────────────────────────────────
out = io.StringIO()
out.write("""/* ============================================================
   JoosAtlas — Korean dictionary
   ------------------------------------------------------------
   Every visible English string maps to its Korean counterpart.
   To adjust the Korean wording, edit the right-hand side only;
   the left-hand side must stay byte-identical to the English on
   the page or the string will not be translated.

   Strings absent from this file (numbers, units, symbols, proper
   nouns, e-mail addresses) are shown identically in both
   languages by design.
   ============================================================ */
window.JOOS_I18N = {
  ko: {
""")
for k in sorted(KR):
    out.write('    %s: %s,\n' % (json.dumps(k, ensure_ascii=False), json.dumps(KR[k], ensure_ascii=False)))
out.write("  },\n  koAttr: {\n")
for k in sorted(ATTR):
    out.write('    %s: %s,\n' % (json.dumps(k, ensure_ascii=False), json.dumps(ATTR[k], ensure_ascii=False)))
out.write("""  },
  /* Strings produced by the chart and lab code rather than the HTML. */
  koRuntime: {
    "IMAGE DISPLACEMENT (PX)":"영상 변위 (PX)",
    "GROUND EFFECT (CM)":"지상 영향 (CM)",
    "RADIAL RESIDUAL (MM)":"반경 잔차 (MM)",
    "5 CM LIMIT":"5 CM 한계",
    "5 CM":"5 CM",
    "LAB":"실험실",
    "px displacement":"px 변위",
    "local camera vector":"국소 카메라 벡터",
    "azimuth from N":"북 기준 방위각",
    "TS boundary RMSE":"TS 경계 RMSE",
    "boundary points":"경계점 수",
    "placement":"배치",
    "mean":"평균",
    "points":"점 수",
    "at 2.0 px":"2.0 px에서",
    "local scale":"국소 스케일",
    "5 cm limit":"5 cm 한계",
    "m viewing range":"m 관측 거리",
    "Theme:":"테마:",
    "Language: Korean":"언어: 한국어",
    "Language: English":"언어: English",
    "Link copied":"링크를 복사했습니다",
    "Copy blocked by the browser":"브라우저가 복사를 막았습니다",
    "Set to the 5 cm limit":"5 cm 한계로 맞췄습니다",
    "Show data table":"데이터 표 보기",
    "Hide data table":"데이터 표 닫기",
    "WITHIN 5 CM":"5 CM 이내",
    "OVER 5 CM":"5 CM 초과",
    "Status":"상태",
    "at":"거리",
%s  }
};
""" % "".join('    %s:%s,\n' % (json.dumps(k,ensure_ascii=False), json.dumps(v,ensure_ascii=False)) for k,v in RUNTIME_EXTRA.items()))
open('v10/joosatlas-i18n.js','w').write(out.getvalue())
print('wrote v10/joosatlas-i18n.js  (%d bytes)' % len(out.getvalue()))
