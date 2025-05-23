import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ArticleDetailsPage from "./pages/articleDetails/ArticleDetailsPage";
import RegistrationPage from "./pages/register/RegistrationPage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminLayout from "./pages/admin/AdminLayout";
import Comment from "./pages/admin/screens/comments/Comment";
import NewPost from "./pages/admin/screens/posts/NewPost";
import ManagePost from "./pages/admin/screens/posts/ManagePost";
import EditPost from "./pages/admin/screens/posts/EditPost";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategories from "./pages/admin/screens/categories/EditCategories";
import Users from "./pages/admin/screens/users/Users";
import BlogPage from "./pages/blog/BlogPage";
import AboutUs from "./pages/static/AboutUs";

const App = () => {
    return (
        <div className="App font-opensans">
            <Routes>
                <Route index path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<ArticleDetailsPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="posts/new" element={<NewPost />} />
                    <Route index path="posts/manage" element={<ManagePost />} />
                    <Route path="posts/manage/edit/:slug" element={<EditPost />} />
                    <Route path="comments" element={<Comment />} />
                    <Route path="categories/manage" element={<Categories />} />
                    <Route path="categories/manage/edit/:slug" element={<EditCategories />} />
                    <Route path="users/manage" element={<Users />} />
                </Route>
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
