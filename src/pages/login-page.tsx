import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/app/store/hooks";
import { useLoginMutation } from "src/entities/session/api/api";
import { userApi } from "src/entities/user/api/api";
import { ROUTES } from "src/shared/config/routes";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    await login({ email, password }).unwrap();
    const user = await dispatch(userApi.endpoints.getMe.initiate()).unwrap();
    navigate(user.role === "admin" ? ROUTES.admin : ROUTES.app);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          pass
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "loading" : "send"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
