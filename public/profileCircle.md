# API

GET /accounts/profiles/<int:user>/

// 예시: accounts/profiles/13/

# Res

// 인증 정보(JWT)가 있고 내 프로필을 조회할 경우
{
"is_associate_member": true,
"is_social_user": false,
"user_login_type": "일반",
"user": 1,
"name": "김뮤라",
"nickname": "뮤라",
"profile_img": "/media/profile_images/profile.jpg",
"introduction": "안녕하세요!",
"phone": "010-1234-5678",
"preferred_region": {
"id": 1,
"sort_order": 1,
"location": "서울"
},
"github_username": "mura11",
"tag": [
{"id": 1, "name": "Python"},
{"id": 2, "name": "Django"}
],
"grade": "새싹"
}
