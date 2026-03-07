# API

GET /accounts/profiles/<int:user>/

// 예시: accounts/profiles/13/

# Res

// 다른 사람의 프로필을 조회할 경우
{
"is_associate_member": true,
"is_social_user": false,
"user_login_type": "일반",
"user": 2,
"nickname": "라이캣",
"profile_img": "/media/profile_images/profile2.jpg",
"introduction": "테스트",
"preferred_region": {
"id": 2,
"sort_order": 2,
"location": "경기"
},
"github_username": "licat1234",
"tag": [
{"id": 3, "name": "JavaScript"}
],
"grade": "나무"
}
(다른 사람의 프로필일 경우 name, phone 필드 제외됨)

// FAIL
404: {"detail": "찾을 수 없습니다."}
