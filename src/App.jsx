import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import useAuthStore from './stores/authStore';
import GNB from './shared/components/Header/GNB';
import GNBLogin from './shared/components/Header/GNBLogin';
import Footer from './shared/components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import StudyDetailPage from './pages/StudyDetailPage';
import StudyCreatePage from './pages/StudyCreatePage';
import StudyEditPage from './pages/StudyEditPage';
import ProfilePage from './pages/ProfilePage';
import ProfileCreatePage from './pages/ProfileCreatePage';
import PasswordResetPage from './pages/PasswordResetPage';
import NotFoundPage from './pages/404Page';

// 로그인/회원가입 전용 (GNBLogin)
function AuthLayout() {
  return (
    <>
      <GNBLogin />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// 공개 페이지 (GNB - 내부에서 로그인 여부 자동 처리)
function GeneralLayout() {
  return (
    <>
      <GNB />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// // 인증 필요 페이지
function PrivateLayout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return (
    <>
      <GNB />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    element: <GeneralLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/search', element: <SearchPage /> },
    ],
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: '/study/create', element: <StudyCreatePage /> },
      { path: '/study/:studyId', element: <StudyDetailPage /> },
      { path: '/study/:studyId/edit', element: <StudyEditPage /> },
      { path: '/profile/:userId', element: <ProfilePage /> },
      { path: '/profile/create', element: <ProfileCreatePage /> },
      { path: '/password-reset', element: <PasswordResetPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
