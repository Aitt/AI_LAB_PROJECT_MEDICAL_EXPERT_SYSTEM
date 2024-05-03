import { Fact, Knowledge, RuleInterface } from "../../interface";
import Knowledges from "../../pages/knowledge";

const apiUrl = "http://localhost:8080";

async function GetUser() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/users`, requestOptions)
      .then((response) => response.json())
      .then(({ data }) => (data ? data : false));
  
    return res;
  }

  async function GetKnowledge() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/knowledges`, requestOptions)
      .then((response) => response.json())
      .then(({ data }) => (data ? data : false));
  
    return res;
  }


  async function CreateKnowledge(data: Knowledge) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/knowledge`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
  }

  async function DeleteKnowledge(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/knowledgeD/${id}`, requestOptions)
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


  async function GetRuleById(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/rule/${id}`, requestOptions)
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

  async function CreateRule(data: RuleInterface) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/rules`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
  }

//   async function UpdateRule(data : RuleInterface) {
//     const requestOptions = {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data.ID),
//     };
  
//     // let res = await fetch(`${apiUrl}/rules`, requestOptions)

//   //   let res = await fetch(`${apiUrl}/rule/${data.ID}`, requestOptions)
//   //     .then((response) => response.json())
//   //     .catch((error) => {
//   //       console.error("Error:", error);
//   //       return false;
//   //     });
  
//   //     console.log("Response from UpdateRule:", res); // เพิ่มบรรทัดนี้เพื่อดูค่าที่ได้รับกลับมา
//   //   return res;
//   // }

//   let res = await fetch(`${apiUrl}/rule/${data}`, requestOptions)
//   .then((response) => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error(`HTTP error ${response.status}`);
//     }
//   })
//   .then((data) => {
//     console.log("Response from UpdateRule:", data);
//     return { status: true, message: data };
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     return { status: false, message: error.message };
//   });

// return res;
//   }
  


// async function UpdateRule(data: RuleInterface) {
//   const requestOptions = {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   };

//   try {
//      let res = await fetch(`${apiUrl}/rules`, requestOptions)
//     const response = await fetch(`${apiUrl}/rule/${data.ID}`, requestOptions);
//     const responseData = await response.json();

//     if (response.ok) {
//       return { status: true, message: responseData.data };
//     } else {
//       return { status: false, message: responseData.error || 'An error occurred' };
//     }
//   } catch (error) {
//     console.error('Error updating rule:', error);
//     return { status: false, message: 'An error occurred while updating the rule' };
//   }
// }

async function UpdateRule(data: RuleInterface) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/rules`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}


// async function UpdateRule(data: RuleInterface) {
//   const url = `${apiUrl}/rule/${data.ID}?editRuleId=${data.editRuleId}`; // เพิ่ม editRuleId ใน URL
//   const requestOptions = {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   };

//   try {
//     const response = await fetch(url, requestOptions); // ใช้ URL ที่มี editRuleId
//     const responseData = await response.json();

//     if (response.ok) {
//       return { status: true, message: responseData.data };
//     } else {
//       return { status: false, message: responseData.error || 'An error occurred' };
//     }
//   } catch (error) {
//     console.error('Error updating rule:', error);
//     return { status: false, message: 'An error occurred while updating the rule' };
//   }
// }

// async function UpdateRule(data: RuleInterface) {
//   const requestOptions = {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   };

//   try {
//     const response = await fetch(`${apiUrl}/rule/${data.ID}`, requestOptions);
//     const responseData = await response.json();

//     if (response.ok) {
//       return { status: true, message: responseData.data };
//     } else {
//       return { status: false, message: responseData.error || 'An error occurred' };
//     }
//   } catch (error) {
//     console.error('Error updating rule:', error);
//     return { status: false, message: 'An error occurred while updating the rule' };
//   }
// }



  async function GetOperator() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/Operator`, requestOptions)
      .then((response) => response.json())
      .then(({ data }) => (data ? data : false));
  
    return res;
  }

  async function DeleteRule(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/deleteRule/${id}`, requestOptions)
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

  async function GetKnowledgeByID(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/knowledges/${id}`, requestOptions)
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

  async function SearchFact(id: Number,name: string) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    try {
      const response = await fetch(
        `${apiUrl}/fact/search/${id}/${name}`,
        requestOptions
      );
      const data = await response.json();
  
      if (response.status === 200) {
        return data.data || [];
      } else {
        throw new Error("not found this fact");
      }
    } catch (error) {
      console.error("not found this fact:", error);
      throw new Error("not found this fact");
    }
  }
  async function GetFact() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/fact`, requestOptions)
      .then((response) => response.json())
      .then(({ data }) => (data ? data : false));
  
    return res;
  }
  async function GetRules() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/getrule`, requestOptions)
      .then((response) => response.json())
      .then(({ data }) => (data ? data : false));
  
    return res;
  }

  async function DeleteFact(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/delfact/${id}`, requestOptions)
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

  async function CreateFactList(data: Fact) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/facts`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
  }

  async function GetFactByID(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AuthorizationAdmin: `${localStorage.getItem("token")}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/getfacts/${id}`, requestOptions)
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
    GetUser,
    GetKnowledge,
    CreateKnowledge,
    DeleteKnowledge,

    GetRuleById,
    CreateRule,
    GetOperator,
    DeleteRule,
    GetKnowledgeByID,
    SearchFact,
    GetFact,
    CreateFactList,
    DeleteFact,
    GetRules,
    GetFactByID,
    UpdateRule
}