import { useState, useEffect } from "react"
import { Button, Card, Form, Input, Layout, Modal, Space } from "antd";
import Footers from "../../layout/footer";
import Nav from "../../layout/navbar";
import { Content } from "antd/es/layout/layout";
import Table, { ColumnsType } from "antd/es/table";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ArrowBack, DeleteOutlined } from "@mui/icons-material";
import { Fact } from "../../interface";
import { useNavigate, useParams } from "react-router-dom";
import { CreateFactList, DeleteFact, GetFactByID, GetKnowledgeByID } from "../../service/https";
export default function CreateFact() {

    const [dataFact, setDataFact] = useState<Fact[]>([]);
    const [Addform] = Form.useForm();

    const [dataKnowledge, setDataKnowledge] = useState<any>({}); // เพิ่ม state สำหรับเก็บข้อมูล Knowledge
    let {id} = useParams(); //ดึง Konwledge ID มาใช้ได้

    const getKnowledge = async () => {
        try {
          let res = await GetKnowledgeByID(Number(id));
          if (res) {
            setDataKnowledge(res);
          }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const onFinish = async (values: Fact) => {

        values.KnowledgeID = Number(id);

        try {
          let res = await CreateFactList(values);
        
          if (res.status) {
            getFact();
            Addform.resetFields();
            toast.success("บันทึกข้อมูลสำเร็จ");
          } else {
            toast.error(res.message);
            console.log('Error' + res.message)
          }
        } catch (error) {
          toast.error("เกิดข้อผิดพลาด ! " + error);
        }
    };
      

    const getFact = async () => {
        try {
          let res = await GetFactByID(Number(id));
          if (res) {
            setDataFact(res);
          }
        } catch (error) {
        }
    };
    useEffect(() => {
        getFact();
        getKnowledge();
        

    }, []);

    const columns: ColumnsType<Fact> = [
        {
            title: 'NO',
            width: '8%',
            align: 'center',
            render: (text, object, index) =>  index + 1
        },
        {
            title: 'Fact Name',
            dataIndex: 'FactName',
            key: 'FactName',
            align: 'center',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            align: 'center',
        },
        {
            title: 'Data Management',
            align: 'center',
            width: '15%',
            render: (record) => (
                <Space style={{flexWrap: 'wrap', justifyContent: 'center'}}>     
        
                    <Button onClick={() => showModal(record)} className='deleteicon'>
                        <DeleteOutlined />
                    </Button>
                </Space>      
              ),
        },
    ];
   

    const showModal = (val: Fact) => {
        setModalText(
            `จะลบจริง ๆ หรอ คิดดี ๆ นะจ๊ะ`
        );
        setDeleteId(val.ID);
        setOpen(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        let res = await DeleteFact(deleteId);
        if (res) {
            toast.success("ลบข้อมูลสำเร็จ");
            setOpen(false);
            getFact();
        } else {    
            toast.error("เกิดข้อผิดพลาด ! " + res.message);
            setOpen(false);
        }
        setConfirmLoading(false);
    };
    
    const handleCancel = () => {
        setOpen(false);
    };
    const [deleteId, setDeleteId] = useState<Number>();
    const [,setModalText] = useState<String>();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/knowledge');
    };

    return (
        <>
        <Nav/>
            <Content className="content">    
                <Card className="CardCreate">       

                <Layout style={{ padding: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', textAlign: 'center' }}>
                        <div onClick={() => handleGoBack()} style={{ marginRight: 'auto' }}> 
                            <ArrowBack/> 
                        </div>
                        <div style={{ marginRight: 'auto' }}>
                            {dataKnowledge[0]?.Title} 
                        </div>
                    </div>
                </Layout>                     
                    
                    <Form 
                        style={{ display: 'flex', justifyContent: 'center' }} 
                        form={Addform}
                        onFinish={onFinish} 
                        autoComplete="off">  

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center', marginRight:10 }}>
                            <Form.Item name="FactName" label="FACT" >
                                <Input/>
                            </Form.Item>  
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center', marginRight:10 }}>
                            <Form.Item name="Description" label="Description" >
                                <Input/>
                            </Form.Item>  
                        </div>                     
                         
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                type='primary'
                                htmlType="submit">
                                Create FACT
                            </Button>
                        </div>
                    </Form>
                </Card>
                <Card 
                    title="LIST OF FACTS TABLE"
                    style={{marginTop:'10px', textAlign:'center'}}>
                    <Table
                        dataSource={dataFact} 
                        columns={columns} 
                        size="middle"
                        pagination={{pageSize:5}}
                        rowKey={obj => obj.ID}/>
                </Card>
            </Content>
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
                cancelButtonProps={{ style: { background: '#FF4B4B', borderColor: '#FF4B4B' } }}>
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
        <Footers/>
        </>
    );    
}