# 프로젝트 개별 개발 리포트

## 1. 기본 정보
- **프로젝트명**: SEVEN
- **작성자**: [이준오]
- **기간**: [8월 1일 - 8월 28]
- **팀명/소속**: 3조

---

## 2. 프로젝트 개요
- **목적**: 사용자의 운동 기록을 그룹별로 관리하고, 주간/월간 랭킹을 확인할 수 있는 시스템 개발
- **배경 / 문제 정의**: 기존 운동 기록 관리 방법의 불편함을 개선하고, 사용자 참여를 유도
- **기대 효과**: 그룹별 랭킹 조회 및 기록 추적 기능으로 동기 부여 및 기록 관리 효율 향상

---

## 3. 개발 환경 및 기술 스택
- **언어**: JavaScript (Node.js)
- **프레임워크 / 라이브러리**: Express, Prisma
- **데이터베이스**: PostgreSQL
- **개발 도구**: VSCode
- **버전 관리**: Git

---

## 4. 요구 사항 / 기능 명세
- **주요 기능**
  - 운동 기록 조회 ✅ (내 역할)
  - 그룹 랭킹 조회 ✅ (내 역할)
  - 디스코드 알림
- **화면 설계 / API 명세**
  - [API 명세 링크 또는 캡처 첨부]

---

## 5. 설계 및 구현

### 5.1 시스템 구조
- 클라이언트 → 서버(Express) → DB(PostgreSQL)
- 이미지 첨부 가능


### 5.2 데이터베이스 설계

group   -  GET          - response body
        -  GET          - request params       - groupId

                        - responseBody          - id 
                                                - name
                                                - decription
                                                - 사진 url
                                                - 목표횟수
                                                - nickname 
                                                - 비밀번호
                                                - 참가자( 모델 ) -
                                                - 태그
                                                - 기록
                                                - 좋아요수
                                                - 배지
                                                - 생성일 
                                                - 수정일  
        
        -  POST         - request Body
                        - response body

        - PATCH         - response body


record  -  GET         - request params     - groupId

                       - request  query     - limit
                                            - page
                                            - search 
                                            - order

                        -response body      - id
                                            - exerciseType 
                                            - distance
                                            - photo
                                            - author            - participants_id
                                                                - nickname 
                                                                - password
                    
        -  POST        - request params 



rank(endpoint)      - recordTime
                    - recordCount
                    - author           - participants_id
                                        - nickname 
                                        - duration


### 5.3 내 역할 및 핵심 로직

#### 5.3.1 운동 기록 조회

- **역할**: 특정 그룹/사용자의 기록 목록 조회 기능 구현

- **핵심 로직**
  1. 사용자 ID, 그룹 ID를 받아 기록 조회
  2. 조회 옵션(페이징, 정렬) 적용

- **코드 예시**

```javascript
router.get("/records", async (req, res) => {
  const { groupId, userId } = req.params;
  const records = await recordsController.getRecords(groupId, userId);
  res.json(records);
});

```

#### 5.3.2 특정 그룹내 랭크 조회
    - ** 역할 ** : 그룹 아이디와 기간을 받아서 기록조회

    - ** 핵심로직** :
   
    1. 오늘 기준으로 지난주와 달을 조회

    2. 정렬 함수를 써서 운동량에 따른 내림차순으로 정렬후 각각의 랭크를 연결

    3. API함수 만들기


#### 테스트 결과 

    GET /groups/1/rank
    Response: { "nickname": "Jun", "rank": 1, "count": 10 }


#### 회고 
    기록 전체 조회 하는 부분은 엄청 후딱 넘어 가버렸음 .... 하지만 코드를 짜는 부분은 엄청 쉬웠으나, 팀원이 짜줬던 스키마에대해 이해하는데 애를 먹었움... 
    해당과정에서 내가 간과 했던 부분이 팀원과 같이 설계도를 그리지않고, 코드를 접근하였기에 필연적인 결과였음.. 
    
    git을 merge rebase, 브랜치 생성 후 원격 브랜치에 연결하는 부분이 나를 미치게 만들었었음 ,,,,,,,, 

    랭킹 조회부분에선 오늘기준으로 주간, 월간 계산하여하며, 핵심로직에서 2번째 단계를 이해하는데 조금 오래걸렸고, 그룹바이를 처음에 써서 그룹화를 먼저시켜주고 참여자수를 구하려고 하였으나 findMany 와 같은 프리즈마 메소드와 달리 외부 정보를 받는데있어서 어려움을 겪었고, 그리하여 findMany 로 여러 기록을 받아서, 하나하나 매핑해주는 과정을 택함..... 해당과정에서 깨달은 점이 하나 더 있었다면, api 명세서를 세분화 하는 과정이 반드시 필수이며, 주석 처리를 하여서 세분화를 반드시 해야하며 topdown 방식으로 큰문제 -> 작은문제로 쪼개는 과정이 필수임. 



    중복되는 라우트 라우터로 묶어서 처리하는 건 알고있었으나, 특정 중북 부분을 어떻게 접근하여서 나아갈지에대한 여러 고민이 발생함.. 이로인하여 라우터가 존재하지 않는다는 오류가 발생..... app. express(merge)  이런 형식이 필요로 함..
    ## what Ive studied

    class 와 함수의 차이

    프로젝트 과정을 리팩토링 하다가 arrow function 을 class 내부에 적용 시키려고 해보니 syntax 오류가 났다..왜일까? 일단 클래스랑 함수 좀 많이 비슷하다. 물론 함수는 동작중심인 방면, class는 객체 중심이라는 것은 알고 있었다. 하지만 내부적으로 뭐가 다른지에 대해서 알지는 못했다. 클래스의 기본속성(프로토타입) 은[isClasscontructor] 라는 필드에 참을 갖고 `new`라는 생성자를 호출한다. 또한 `strict mode` 로 안전하고 예측가능 하며, 객체 프로퍼티 열거가 불가능 합니다. `메서드`는 반대로 [isClasscontructor] 라는 속성을 갖지 않고, 저 해당속성 때문에 new 라는 생성자를 호출 할 필요가 없다. 클래스 내부에서 바인딩을 통해서 모든 메소드의 결과를 프로토타입으로 저장.. 하지만 arrow functon을 쓰면 [constuct] 속성이 없기에 인스턴스에 저장 됩니다.
    애로우 펑션을 쓰면 binding 할필요가 없어짐

    dynamic selection


    여기서 동적이란 컴퓨터 사이언스에서의 개념은 프로그램 실행동안에 값이 변경 되거나 결정 되는 현상을 말한다. 그렇다면 여기서 프로그램이 실행되는 동안에 select를 바꿀수 있다는 말 (비동기랑은 아예다름).. 두가지 방법이 있는데 type 쓰거나 class 내 공통 특성에서 sellect 객체를 생성해서 넣는 방법이었다..
    type script에 대해서는 아직 배우지 않아서, 눈으로 만코드를 읽었고, NOde.js는 현재 배우는 중이기에 좀더 집중적으로 보겠다. 우리는 앞서서 class 내 공통된 필드 즉 속성을 내려다 줄수있는 constructor 배웠다. constructor 안에 this.sellect 객체를 생성한다음, 해당 객체 내부에 공통된 field를 넣고, 만약에 추가 하고 싶다면 나중에 객체로 추가하고 싶은 필드를 내려다 주면 된다..

    ```js
        class Service{
            constructor(){
                this.sellect = {id: true, name = true}
            }
            buildOption(choice) return {...this.sellect, ...choice}


            userInfo = async (req, res) => {
                const id = Number(req.params.id)
                const choice = req.query.choice
                const finalOption = this.buildOption(
                    choice?
                    json.parse(choice): {}
                    )
                    try{
                        ...
                        select : finalOption
                    }
            }

            record = async(req, res ) =>{
                const id = Number(req.params.id)
                const finalOption = this.buildOption({
                    record : true // 기록 정보를 추가
                })
            }

        }
    ```

    orderBy

    orderby는 객체를 배열화 해서 정렬하는 기능
    객체를 배열화 해야함(조건에 따라)

    다중 정렬: 2개 이상의 칼럼

    단일 정렬: 하나의 칼럼


    Dynamic orderBy

    한국어로 동적 정렬이라고도 불린다. 프로그램을 실행하는 동안 정렬을 바꿀수 있다. 우선 constructor 에서 this.order = 객체로 기본 속성을 갖는다.

    ```js
    class service {
        constructor (){
            this.order = {
                "latest" = { createdAt :"desc"},
                "heighest price" = {price : "asc"}
                }
            }
        buildOrder (sortType, extraOrder){
            const baseOrder = this.order[sortType] || { createdAt : "desc" }
            if (!extraOrder) {
                return baseOrder
            }
            return Array.isArray(baseOrder)? [...baeseOrder, ...extraOrder] : [ baseOrder, ...extraOrder];
        }
        productList = async(req, res) => {
            const id = Number(req.params.id)
            const finalOrder = buildOrder(sortType, [{ lowest : "desc"}])
            // instance of prisma 
            ...
            {
                orderBy : finalOrder
            }
        }
    }

    ```


