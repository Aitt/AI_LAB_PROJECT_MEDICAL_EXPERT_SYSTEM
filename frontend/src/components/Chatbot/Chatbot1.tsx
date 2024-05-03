import React, { useEffect, useState } from "react";
import Chats from "../Chats/Chats1";
import { analyzeNextSteps1 } from "../Function/analyzeNextSteps1";
import "./Chatbot.css";
import { SendOutlined } from "@mui/icons-material";
import { Knowledge, RuleInterface } from "../../interface";
import { GetKnowledge, GetRules } from "../../service/https";

export interface ResponseBotObject {
  purpose: string;
  message: string;
  options?: string[];
  sender: string;
}

const Chatbot: React.FC = () => {
  const [userResponse, setUserResponse] = useState<string>("");
  const [dataKnowledge, setDataKnowledge] = useState<Knowledge[]>([]);
  const [dataRules, setDataRule] = useState<RuleInterface[]>([]);
  const [step, setStep] = useState<number>(0);
  const [botResponse, setBotResponse] = useState<ResponseBotObject>({
    purpose: "",
    message: "",
    sender: "bot",
  });
  const [sendUserResponse, setSendUserResponse] = useState<string>("");
  const [userResponses, setUserResponses] = useState<string[][]>([]);

  const getKnowledge = async () => {
    try {
      let res = await GetKnowledge();
      if (res) {
        setDataKnowledge(res);
      }
    } catch (error) {
      console.error("Error fetching knowledge:", error);
    }
  };

  const getRule = async () => {
    try {
      let res = await GetRules();
      if (res) {
        setDataRule(res);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  useEffect(() => {
    getKnowledge();
    getRule();
  }, []);

  const setNextStep = (response: string) => {
    setSendUserResponse(response);

    let res = analyzeNextSteps1(
      step,
      response,
      dataKnowledge,
      dataRules,
      setBotResponse
    );

    if(response === "เลือกหัวข้อใหม่") {
      setStep(1)
      setBotResponse({
        purpose: "specify 2ee",
        message: `อยากจะสอบถามหรือมีข้อสงสยด้านใดครับผม??`,
        options: dataKnowledge.map((knowledge) => `${knowledge.Title}`),
        sender:"bot"
      })
      setStep((prevStep) => prevStep + 1);
    }

    if(typeof res === "object" && Object.keys(res).length !== 0) {
      setBotResponse({
        purpose: res.purpose || "",
        message: res.message || "",
        options: res.options || [],
        sender: "bot",
      });
      setStep((prevStep) => prevStep + 1);
    }
  };

  const optionClick = (e: React.MouseEvent<HTMLElement>) => {
    let option = e.currentTarget.dataset.id;

    if (option) {
      setNextStep(option);
      e.currentTarget.classList.add("selected");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserResponse(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNextStep(userResponse);
  };

  const handleReset = () => {
    setUserResponse("");
    setStep(0);
    setBotResponse({ purpose: "", message: "", sender: "bot" });
    setSendUserResponse("");  
    setUserResponses([]);
    window.location.reload();
  };

  return (
    <div className="chat-container" style={{ marginLeft: "auto", marginRight: "auto" }}>
      <Chats
        userResponse={userResponse}
        botResponse={botResponse}
        sendUserResponse={sendUserResponse}
        optionClick={optionClick}
      />
      <div>
        <form onSubmit={(e) => handleSubmit(e)} className="form-container">
          <input onChange={(e) => handleInputChange(e)} value={userResponse}></input>
          <button>
            <i className="far fa-paper-plane">
              <div style={{ marginTop: "-4px" }}>
                <SendOutlined />
              </div>
            </i>
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;