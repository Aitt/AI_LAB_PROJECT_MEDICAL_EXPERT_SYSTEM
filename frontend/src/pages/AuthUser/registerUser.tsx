import React, { useState } from 'react';
import {
  Col,Card,Space,Button,Form,Input,message,Divider, Select,
} from "antd";
import "./styleUser.css";
import { Link, useNavigate } from "react-router-dom";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { SignUpForUser } from '../../service/https/AuthUser';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function RegisterUser() {
  const [, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onSignUp = async (value: any) => {
    var res = await SignUpForUser(value);

    if (res.status) {
      toast.success("ลงทะเบียนสำเร็จ");
      setTimeout(() => navigate(`/user`), 2500);
    } else {
      toast.error("ลงทะเบียนไม่สำเร็จ " + res.message);
    }
  };

  const handleClick = () => {
    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  }

  const [size, ] = useState<SizeType>('large'); 

  return (
    <>                
      {contextHolder}
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className='img-back' style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <text style={{
            fontSize: '60px', marginLeft: '0px',
            marginTop: '0px',
            fontWeight: 'bolder', color: 'white'
          }}>
          </text>
          <Space direction="vertical" size="middle">

            <div style={{ marginTop: '-400px' }}>
              <Card style={{ height: "130px", marginTop: '0px', marginBottom: "-30px", }}>
                <div className="label" style={{ marginLeft: "30px", marginRight: "30px" }}>
                  <p className="div">
                    <span className="text-wrapper">REGISTER</span>
                    <span className="span">&nbsp;</span>
                    <span className="text-wrapper-2">for User</span>
                    <span className="space"></span>
                    <Button onClick={handleClick} className="custom-button" danger>Login for Admin only</Button>
                  </p>
                </div>
              </Card>
              <Form
                name="basic"
                layout="vertical"
                onFinish={onSignUp}
                autoComplete="off"
              >
                <Card size="small" style={{ height: "320px" }}>
                  <div style={{ marginBottom: "10px", marginTop: "20px", marginLeft: "30px", marginRight: "30px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', gap:'10px'}}>
                            <Form.Item
                                className="form-item-wrapper"
                                style={{width:'200px'}}
                                label="Title"
                                name="TitleName"
                                rules={[
                                {
                                    required: true,
                                    message: "Please select !",
                                },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="Mr.">Mr.</Select.Option>
                                    <Select.Option value="Mrs.">Mrs.</Select.Option>
                                    <Select.Option value="Miss">Miss</Select.Option>
                                    <Select.Option value="Ms.">Ms.</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                    className="form-item-wrapper"
                                    label="FullName"
                                    name="FullName"
                                    rules={[
                                    {
                                        required: true,
                                        message: "Please enter your name !",
                                    },
                                    ]}
                                >
                                <Input />
                            </Form.Item>
                        </div>                       
                      <Form.Item
                        className="form-item-wrapper"
                        label="Username"
                        name="UserNameU"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your username !",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="Password"
                        name="PasswordU"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your password !",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Divider />
                  </div>
                </Card>
                <Card style={{ height: "85px", marginTop: "-15px", }}>
                  <div className="label" style={{ marginLeft: "18px", marginRight: "30px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Button htmlType="submit" className='custom-button2' type="primary" size={size}>
                        Register
                      </Button>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">or</span>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='/user' className='custom-button3' type="link">
                        Login
                      </Link>
                      <span>&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">for user?</span>
                    </Col>
                  </div>

                </Card>
              </Form>
            </div>

          </Space>
        </div>
      </Col>

      <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"/> 
    </>
  );
};
