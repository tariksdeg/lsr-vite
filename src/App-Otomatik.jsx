import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [url, setUrl] = useState("https://test.platform.pentestbx.com");
  // const [url, setUrl] = useState("http://10.0.30.5:3000");
  const [email, setEmail] = useState("admin@pentestbx.com");
  const [password, setPassword] = useState("93n73578x");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        url,
        email,
        password,
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ status: "error", message: "Giriş işlemi başarısız oldu" });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default LoginForm;
