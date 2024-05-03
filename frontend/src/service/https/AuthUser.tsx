const apiUrl = "http://localhost:8080";

async function LoginForUser(data: { UserNameU: string; PasswordU: string }) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/loginUser`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.message) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("result", res.result);
        localStorage.setItem("access", 'user')
        return { status: true };
      } else {
        return { status: false, message: res.error };
      }
    });
  return res;
}

async function SignUpForUser(data: any) {
  console.log(data);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/singupUser`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.message) {
        return { status: true, message: res.message };
      } else {
        return { status: false, message: res.error };
      }
    });
  return res;
}
async function CheckTokenUser() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // AuthorizationUser: `${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/checktokenUser`, requestOptions);
  if (res.ok) {
    return;
  } else {
    window.location.href = `/`;
  }
}

export {
    LoginForUser,
    SignUpForUser,
    CheckTokenUser,
};
  