const apiUrl = "http://localhost:8080";

async function LoginForAdmin(data: { UserNameA: string; PasswordA: string }) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/loginAdmin`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.message) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("adminId", res.adminId);
        localStorage.setItem("result", res.result);
        localStorage.setItem("access", 'admin')
        return { status: true };
      } else {
        return { status: false, message: res.error };
      }
    });
  return res;
}

async function SignUpForAdmin(data: any) {
  console.log(data);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/singupAdmin`, requestOptions)
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
async function CheckTokenAdmin() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // AuthorizationAdmin: `${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/checktokenAdmin`, requestOptions);
  if (res.ok) {
    return;
  } else {
    window.location.href = `/`;
  }
}

async function GetAdminById(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/getadmin/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } else {
          return false;
        }
      });
  
    return res;
  }
  

export {
    LoginForAdmin,
    SignUpForAdmin,
    CheckTokenAdmin,
    GetAdminById,
};
  