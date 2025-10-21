import { RecruitmentProgram } from '@/types/recruitment';

export const mockRecruitmentPrograms: RecruitmentProgram[] = [
  {
    id: 'testtest-1',
    title:
      'First Recruitment Program First Recruitment Program First Recruitment Program First Recruitment Program',
    description: `# 🚀 Ludium Portal 재구축 컨트리뷰터 모집

      안녕하세요, 루디움입니다.
      루디움 포털은 **빌더의 교육 → 취업 연계 → 투자**까지 지원하는 글로벌 플랫폼으로, 지난 1년간 다양한 기능들을 빠르게 개발해왔습니다.

      이번에는 **포털을 근본적으로 재구축**하고, 앞으로는 **오픈소스 기반 컨트리뷰션**으로 발전시켜 나가려 합니다. 이를 위해 이번 프로젝트에 함께할 컨트리뷰터 3명을 모집합니다.

      ***

      ## 🎯 왜 재구축하나요?

      그동안 빠른 구현에 집중하다 보니 **코드 정합성, 문서화, 협업 체계**에서 부족한 부분이 있었습니다.
      이번 재구축은 단순한 코드 리팩토링을 넘어,

      * **개발 문서화 체계 확립**
      * **외부 기여자 친화적인 구조 정비**
      * **UX·QA 개선**
        을 목표로 합니다.

      ***

      ## 👥 모집 포지션 (총 3명)

      ### 1. **Backend Contributor (1명)**

      * 기술 스택: \`Node.js\`, \`TypeScript\`, \`Fastify\`, \`PostgreSQL\`, \`GraphQL\`
      * 주요 역할:
        * 기존 API 리팩토링 및 문서화
        * 데이터 모델 및 ORM 구조 개선
        * Auth & Role 기반 로직 정비

      ***

      ### 2. **Smart Contract Contributor (1명)**

      * 기술 스택: \`Solidity\`, \`Hardhat\`, \`OpenZeppelin\`
      * 주요 역할:
        * 기존 컨트랙트 리팩토링 및 최적화
        * Warranty / Escrow / Payment 로직 리뷰
        * 보안 검토 및 테스트 강화

      ***

      ### 3. **UX Designer (1명)**

      * 역량: UX 리서치, 와이어프레임, 프로토타입 제작
      * 주요 역할:
        * 전체 사용자 플로우 재정리
        * 프로그램/프로젝트/프로필 UX 개선안 설계
        * 컨트리뷰터 친화적인 화면 구조 제안

      ***

      ## 🛠️ 협업 방식

      * **GitHub 기반 Branch Workflow**
        * \`main\` : 항상 배포 가능한 상태
        * \`dev\` : 통합 브랜치
        * \`feature/xxx\` : 기능 단위 브랜치
      * **PR 필수 리뷰 → 코드 머지**
      * **주간 개발 회의** 진행 (진행 상황 공유 + QA)

      레퍼런스 자료:

      * [포털 로드맵](https://kindly-smoke-eb0.notion.site/250706-Portal-Roadmap-2025-227b8bf83c2b807da558dd891835062c)
      * [개발 협업 가이드라인](https://kindly-smoke-eb0.notion.site/277b8bf83c2b80bc9fd2ff0606577878?source=copy_link)
      * [GitHub Projects](https://github.com/orgs/Ludium-Official/projects/7/views/1)

      ***

      ## 📅 모집 일정

      * 모집 인원: 3명 (Backend 1 / Contract 1 / UX Designer 1)
      * 모집 마감: 2025년 9월 28일 (일)
      * 활동 기간: **2025년 10월 (1개월 집중 기여)**

      ***

      ## 💡 지원 방법

      👉 루디움 포털 [커뮤니티](https://www.ludium.world/community)에서 댓글 혹은 메일로 간단한 자기소개와 관심 포지션을 남겨주세요.
      메일: [**contact@ludium.world**](mailto:contact@ludium.world)

      ***

      ## ✨ 함께하면 좋은 분

      * 오픈소스 기여 경험이 있는 분
      * Web3, 블록체인, 빌더 생태계에 관심이 많은 분
      * 단순 개발뿐 아니라, **플랫폼을 함께 성장시킬 의지**가 있는 분

      ***

      🙌 루디움 포털의 새로운 도약에 함께해주세요`,
    skills: ['React', 'NextJS'],
    deadline: '2025-10-19 09:15:50.716221',
    createdAt: '2025-09-12 09:15:50.716221',
    budgetType: 'fixed',
    network: 'educhain-testnet',
    price: '3000',
    currency: 'EDU',
    visibility: 'public',
    builders: [],
    status: 'open',
    applicantCount: '3',
    sponser: '0x997509126078FB59ce9D01654a973F92bBedD6a3',
  },
  {
    id: 'testtest-2',
    title: 'Second Recruitment Program',
    description: '### Second Recruitment',
    skills: ['Express', 'NestJS'],
    deadline: '2025-10-20 09:15:50.716221',
    createdAt: '2025-10-12 09:15:50.716221',
    budgetType: 'negotiable',
    network: null,
    price: null,
    currency: null,
    visibility: 'public',
    builders: [],
    status: 'draft',
    applicantCount: '0',
    sponser: '0x997509126078FB59ce9D01654a973F92bBedD6a3',
  },
  {
    id: 'testtest-3',
    title: 'Third Recruitment Program',
    description: '### Third Recruitment',
    skills: ['Cosmos', 'Osmosis'],
    deadline: '2025-10-11 09:15:50.716221',
    createdAt: '2025-10-01 09:15:50.716221',
    budgetType: 'fixed',
    network: 'arbitrum-sepolia',
    price: '2',
    currency: 'USDT',
    visibility: 'public',
    builders: [],
    status: 'closed',
    applicantCount: '7',
    sponser: '0x997509126078FB59ce9D01654a973F92bBedD6a3',
  },
];
