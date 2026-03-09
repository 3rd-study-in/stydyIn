# API

GET /study/<int:study_pk>/

# Res

{
"id": 1,
"title": "Python 기초 스터디 - 모집중",
"thumbnail": "/media/img/study/thumbnail/study1.png",
"is_offline": false,
"study_location": null,
"recruitment": 5,
"study_info": "Python 기초 문법부터 시작하는 스터디입니다.",
"leader": {
"id": 2,
"profile": {
"nickname": "라이캣",
"introduction": "Python과 Django를 좋아합니다.",
"profile_img": "https://via.placeholder.com/150",
"preferred_region": {
"id": 1,
"sort_order": 1,
"location": "제주특별자치도"
},
"grade": "초록잔디"
}
},
"study_day": [
{
"id": 1,
"name": "월"
},
{
"id": 3,
"name": "수"
}
],
"start_date": "2026-02-01",
"term": 8,
"start_time": "19:00:00",
"end_time": "21:00:00",
"difficulty": {
"id": 1,
"name": "초급"
},
"search_tag": [
{
"id": 1,
"name": "Python"
}
],
"subject": {
"id": 1,
"name": "개념학습"
},
"study_status": {
"id": 1,
"name": "모집 중"
},
"participants": [
{
"id": 2,
"profile": {
"nickname": "라이캣",
"introduction": "Python과 Django를 좋아합니다.",
"profile_img": "/media/profile_images/profile3.jpg",
"preferred_region": {
"id": 1,
"sort_order": 1,
"location": "제주특별자치도"
},
"grade": "초록잔디"
}
}
],
"like_users": []
}
