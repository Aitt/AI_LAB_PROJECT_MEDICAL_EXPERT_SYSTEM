import React, { useState } from 'react';
import {
  Col,Card,Space,Button,Form,Input,message,Divider,
} from "antd";
import "./styleAdmin.css";
import { Link } from "react-router-dom";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginForAdmin } from '../../service/https/AuthAdmin';


export default function LoginAdmin() {
  const [, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    var res = await LoginForAdmin({
      UserNameA: values.UserNameA,
      PasswordA: values.PasswordA,
    });
    if (res.status) {
      toast.success("เข้าสู่ระบบสำเร็จ");
      setTimeout(() => {
        window.location.reload();
        window.location.href = '/knowledge';
      }, 2500);
    } else {
      toast.error("เข้าสู่ระบบไม่สำเร็จ " + res.message);
    }
};


  const handleClick = () => {
    setTimeout(() => {
      window.location.href = "/user";
    }, 500);
  }

  const [size, ] = useState<SizeType>('large'); 

  return (
    <>                
      {contextHolder}
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className='img-back2' style={{ display: "grid", placeItems: "center", height: "100vh" }}>
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
                    <span className="text-wrapper">LOGIN FOR ADMIN</span>
                    <span className="span">&nbsp;</span>
                    <span className="space"></span>
                    <Button onClick={handleClick} className="custom-button" danger>Login for User</Button>
                  </p>
                </div>
              </Card>
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Card size="small" style={{ height: "220px" }}>
                  <div style={{ marginBottom: "10px", marginTop: "20px", marginLeft: "30px", marginRight: "30px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="Username"
                        name="UserNameA"
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
                        name="PasswordA"
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
                        Login
                      </Button>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">or</span>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='/regisadmin' className='custom-button3' type="link">
                        Register
                      </Link>
                      <span>&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">with email?</span>
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
