# Supabase for the first time

Supabase를 사이드프로젝트 혹은 프로덕션에서 사용하기 전에 확인해보기 위해 작성했습니다.

그동안 관심은 있었지만 시도해볼 생각은 안 하고 있었는데, 이 [트윗](https://twitter.com/hmmhmm_hm/status/1616778364861255682) 덕분에 시작을 하게되었습니다.

![meme](https://pbs.twimg.com/media/Fm7aWBIXgAc0ip-?format=jpg&name=medium)

마침 stripe까지 붙여 볼 수 있는 [course](https://egghead.io/courses/build-a-saas-product-with-next-js-supabase-and-stripe-61f2bc20)가 있어서 전체적인 내용을 따라가지만, 일부 내용은 바꿔서 진행했습니다.

## 소감

앞으로 메인 스택으로 가져갈 것 같습니다.

여러 가지 부분에서 개발 경험이 좋았습니다. 1) Database를 기반으로 type 생성이 손쉽게 됨. 2) RLS 정책을 이용한 보안 정책 작성이 가능함 (처음 써보는데도 Firebase Security Rule 보다 익숙하게 느껴졌습니다.) 3) provider에게 종속되지 않음. supabase는 오픈 소스이며 postgre를 사용함. 4) local 환경에서 개발이 가능함.

하지만 단점도 있었습니다. 가장 크게 느낀 부분은 triggers, functions, polices 등과 같은 부분을 GUI 이외에서 작성하고 관리할 수 없다는 점입니다. (혹시 잘못 알고 있다면 알려주시면 감사하겠습니다.)

Firebase의 대체재를 표방하는 Supabase인 만큼 Firebase가 제공하는 기능은 대부분 제공합니다. Push notification을 제외하고 Firebase에 비교해서 부족한 기능은 없는 것 같습니다.
