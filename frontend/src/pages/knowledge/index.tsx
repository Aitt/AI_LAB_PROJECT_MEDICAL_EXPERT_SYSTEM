import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Modal, Space } from 'antd';
import Nav from "../../layout/navbar";
import Footers from "../../layout/footer";
import { Content } from "antd/es/layout/layout";
import '../style/styleBtn.css';
import { Card, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { CreateKnowledge, DeleteKnowledge, GetKnowledge } from '../../service/https';
import { Fact, Knowledge } from '../../interface';
import { DeleteOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export default function Knowledges() {
    const [Addform] = Form.useForm();
    const [dataKnowledge, setDataKnowledge] = useState<Knowledge[]>([]);
    const [deleteId, setDeleteId] = useState<Number>();
    const [modalText, setModalText] = useState<String>();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();

    const adminId = localStorage.getItem("adminId");
  
    const onFinish = async (values: Knowledge) => {
        values.AdminID = Number(adminId);
        let res = await CreateKnowledge(values);
        if (res.status) {  

            toast.success("สร้างรายการ Knowledge สำเร็จ");
            getKnowledge(); // ดึงข้อมูลมาแสดงทันทีหลังการสร้าง

            Addform.setFieldsValue({
                'Title': undefined 
            });
        } else {
            toast.error("เกิดข้อผิดพลาด ! " + res.message);
        }
    };

    const getKnowledge = async () => {
        let res = await GetKnowledge();
        if (res) {
            setDataKnowledge(res);
            console.log(res)
        }
    };
    
    useEffect(() => {
        getKnowledge();
    }, []);

    const showModal = (val: Knowledge) => {
        setModalText(
            `กรุณากดยืนยันเพื่อลบ`
        );
        setDeleteId(val.ID);
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        let res = await DeleteKnowledge(deleteId);
        if (res) {
            toast.success("ลบข้อมูลสำเร็จ");
            setOpen(false);
            getKnowledge();
        } else {    
            toast.error("เกิดข้อผิดพลาด ! " + res.message);
            setOpen(false);
        }
        setConfirmLoading(false);
    };
    
    const handleCancel = () => {
        setOpen(false);
    };

    const StateFact= (fact: Fact) => (
        <Checkbox checked={fact.StateFact === '1'} />
    );
    
    const columns: ColumnsType<Knowledge> = [
        {
            title: 'STATE RULE',
            width: '10%',
            align: 'center',
            render: (record) => (
                <Checkbox checked={record.StateRule === '1'} />
            )
        },
        {
            title: 'STATE FACT',
            width: '8%',
            align: 'center',
            render: StateFact,
        },
        {
            title: 'NO',
            width: '8%',
            align: 'center',
            render: (text, object, index) =>  index + 1
        },
        {
            title: 'TITLE OF KNOWLEDGE BASE',
            dataIndex: 'Title',
            key: 'Title',
            width: '30%',
            align: 'center',
        },
        {
            title: 'CREATE BY',
            dataIndex: 'Admin',
            key: 'Admin',
            width: '20%',
            align: 'center',
            render: (item) => `${item.TitleName} ${item.FullName}`,
        },
        {
            title: 'MANAGE',
            width: '30%',
            align: 'center',
            render: (record) => (
                <Space style={{flexWrap: 'wrap', justifyContent: 'center'}}> 

                  <Button className='addbtn' onClick={() =>  navigate(`/createFact/${record.ID}`)}>
                      Add Facts
                  </Button>             
        
                  <Button className='addbtn' onClick={() =>  navigate(`/createRule/${record.ID}`)}>
                      Add Rules
                  </Button>
        
                  <Button className='editbtn'>
                      Edit
                  </Button>
        
                  <Button onClick={() => showModal(record)} className='deleteicon'>
                    <DeleteOutlined />
                  </Button>
                </Space>
        
              ),
        },
    ];

    return (
        <>
            <Nav/>           
                <Content className="content" >                    
                    <Card className="CardCreate" style={{marginTop:'10px'}}>                 
                        <Form
                            name="wrap"
                            labelCol={{ flex: '110px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}
                            colon={false}
                            style={{ maxWidth: 600}}
                            onFinish={onFinish}
                            form={Addform}
                        >
                            <Form.Item 
                                label={
                                    <div>
                                        <span style={{fontWeight:'bold'}}> 
                                            TITLE OF KNOWLEDGE BASE
                                        </span>
                                    </div>
                                } 
                                labelCol={{span: 24}}
                                name="Title" 
                                rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <div className="btnbox">
                                <Button 
                                    type="primary" 
                                    className="createbtn"
                                    htmlType="submit">
                                    Create Knowledge
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    <Card className="" style={{marginTop:'10px'}}>  
                        <Table 
                            dataSource={dataKnowledge} 
                            columns={columns}                          
                            pagination={{pageSize:8}}
                            rowKey={obj => obj.ID}/>
                    </Card>

                    <Modal
                        open={open}
                        onOk={handleOk} 
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        title={<span style={{ color: '#FF4B4B', fontSize:20 }}> คำเตือน !! </span>}
                        style={{fontSize: '16px', minWidth: '400px'}}
                        okText= {<span style={{ color: 'white'}}> ลบข้อมูล </span>}
                        okButtonProps={{ style: { background: '#0BB6DC', borderColor: '#0BB6DC' } }}
                        cancelText= {<span style={{ color: 'white'}}> ยกเลิก </span>}
                        cancelButtonProps={{ style: { background: '#FF4B4B', borderColor: '#FF4B4B' } }}
                    >
                        <p>{modalText}</p>
                    </Modal>

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

                </Content>
            <Footers/>
        </>
    );
}
