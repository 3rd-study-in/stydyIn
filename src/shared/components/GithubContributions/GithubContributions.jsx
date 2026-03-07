/**
 * GitHub Contributions(잔디 농사) 컴포넌트
 * 추후 GitHub API 또는 오픈소스 라이브러리로 교체 예정
 * 현재는 placeholder 이미지로 대체
 */
function GithubContributions({ username }) {
  return (
    <div className="w-full rounded-[10px] overflow-hidden bg-bg-muted">
      <img
        src="https://ghchart.rshah.org/2da44e/octocat"
        alt={username ? `${username}의 GitHub 잔디` : 'GitHub 잔디'}
        className="w-full object-cover opacity-60"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.style.height = '80px';
        }}
      />
    </div>
  );
}

export default GithubContributions;
