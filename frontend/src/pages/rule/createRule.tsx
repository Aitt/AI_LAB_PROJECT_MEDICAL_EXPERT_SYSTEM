import React, { useState, useEffect } from "react";
import { Content } from "antd/es/layout/layout";
import Footers from "../../layout/footer";
import Nav from "../../layout/navbar";
import { Button, Card, Form, Layout, Modal, Select, Space, message } from "antd";
import { DeleteOutlined, EditSharp, Rule } from "@mui/icons-material";
import Table, { ColumnsType } from "antd/es/table";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { CreateRule, DeleteRule, GetKnowledgeByID, GetOperator, GetRuleById, SearchFact, UpdateRule } from "../../service/https";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fact, Knowledge, OperatorInterface, RuleInterface } from "../../interface";




export default function CreateRulesPage() {

    const [dataRule, setDataRule] = useState<RuleInterface[]>([]);
    const [dataOperater, setDataOperator] = useState<OperatorInterface[]>([]);
    let { id } = useParams();
    const [Addform] = Form.useForm();
    const [AddformForEdit] = Form.useForm();
    const { Option } = Select;
    const [dataKnowledge, setDataKnowledge] = useState<Knowledge[]>([]);
    const [, contextHolder] = message.useMessage();

    const knowledge = dataKnowledge.find(knowledge => knowledge.ID === Number(id));
    const [editingRule, setEditingRule] = useState<RuleInterface | null>(null);


    

    const getRuleByID = async () => {
        try {
            let res = await GetRuleById(Number(id));
            if (res) {
                setDataRule(res);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };
    const getoperator = async () => {
        try {
            let res = await GetOperator();
            if (res) {
                setDataOperator(res);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

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

    const [searchResults, setSearchResults] = useState<Fact[]>([]);
    const [searchText] = useState<string>('');

    const handleSearchFact = async (value: string) => {
        try {
            const results = await SearchFact(Number(id), value);
            setSearchResults(results || []);
        } catch (error) {
        }
    };
    useEffect(() => {
        if (searchText.trim() !== '') {
            handleSearchFact(searchText.trim());
        } else {
            setSearchResults([]);
        }
    }, [searchText]);

    const handleResetFields = async () => {
        Addform.resetFields();
    }

    useEffect(() => {
        getRuleByID();
        getoperator();
        getKnowledge();
    }, []);

    const onFinish = async (values: RuleInterface) => {
        try {
            values.KnowledgeID = Number(id);
            values.KnowledgeTitle = knowledge?.Title;

            const res = await CreateRule(values);

            if (res.status) {
                getRuleByID();
                Addform.resetFields();
                setEditingRule(null);
                toast.success("บันทึกข้อมูลสำเร็จ");
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด ! " + error);
        }
    };
    
    const showModal = (val: RuleInterface) => {
        setModalText(
            `กรุณากดยืนยันเพื่อลบ`
        );
        setDeleteId(val.ID);
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        let res = await DeleteRule(deleteId);
        if (res) {
            toast.success("ลบข้อมูลสำเร็จ");
            setOpen(false);
            getRuleByID();
        } else {
            toast.error("เกิดข้อผิดพลาด ! " + res.message);
            setOpen(false);
        }
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };


   
    const handleEditRule = (rule: RuleInterface) => {
        navigate(`/createRule/${id}?editRuleId=${rule.ID}`);
        showModalForEdit(rule);
      };

    const showModalForEdit = async (val: RuleInterface) => {
        val.KnowledgeID = Number(id);
        val.KnowledgeTitle = knowledge?.Title;
      
        const urlParams = new URLSearchParams(window.location.search);
        const editRuleId = urlParams.get('editRuleId');
      
        if (editRuleId) {
          // ตั้งค่าเริ่มต้นของ Form ด้วยข้อมูลของ Rule ที่มี ID ตรงกับ editRuleId
          const ruleToEdit = dataRule.find((rule) => rule.ID === parseInt(editRuleId));
          if (ruleToEdit) {
            AddformForEdit.setFieldsValue(ruleToEdit);
            setEditingRule(ruleToEdit);
          }
        }
        setDeleteId(val.ID);
        getRuleByID();
        setOpenForEdit(true);
        Addform.resetFields();
      };
    
    const handleCancelForEdit = () => {
        setOpenForEdit(false);
        setEditingRule(null); // รีเซ็ต editingRule เป็น null
        AddformForEdit.resetFields(); // รีเซ็ตฟอร์มแก้ไข
    };


    const handleOkForEdit = async (values: RuleInterface) => {
        setConfirmLoadingForEdit(true);
        try {
            values.KnowledgeID = Number(id);
            values.KnowledgeTitle = knowledge?.Title;

            const res = await UpdateRule(values);

            if (res.status) {
                setOpenForEdit(false);
                setEditingRule(null); // รีเซ็ต editingRule เป็น null
                getRuleByID();
                AddformForEdit.resetFields(); // รีเซ็ตฟอร์มแก้ไข
                setEditingRule(null);
                toast.success("อัปเดตข้อมูลสำเร็จ");
            } else {
                toast.error("เกิดข้อผิดพลาด ??! " + res.message);
                setOpenForEdit(false);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดน๊ะ ! " + error);
        }
    };

    const [deleteId, setDeleteId] = useState<Number>();
    const [modalText, setModalText] = useState<String>();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [modalTextForEdit, setModalTextForEdit] = useState<String>();
    const [openForEdit, setOpenForEdit] = useState(false);
    const [confirmLoadingForEdit, setConfirmLoadingForEdit] = useState(false);


    const columns: ColumnsType<RuleInterface> = [
        {
            title: 'Node 1',
            dataIndex: 'Node1',
            key: 'Node1',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Operator',
            dataIndex: 'Operator',
            key: 'Operator',
            width: '5%',
            align: 'center',
            render: (item) => Object.values(item.OperatorName)
        },
        {
            title: 'Node 2',
            dataIndex: 'Node2',
            key: 'Node2',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Result 1',
            dataIndex: 'Result1',
            key: 'Result1',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Result 2',
            dataIndex: 'Result2',
            key: 'Result2',
            width: '20%',
            align: 'center',
        },

        {
            title: 'Data Management',
            align: 'center',
            render: (record) => (
                <Space style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button onClick={() => handleEditRule(record)} className='editicon'>
                        <EditSharp />
                    </Button>
                    <Button onClick={() => showModal(record)} className='deleteicon'>
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/knowledge');
    };


    return (
        <>
            <Nav />
            <Content className="content">

                <Card className="CardCreate">
                    {contextHolder}

                    <Layout style={{ padding: '10px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', textAlign: 'center' }}>
                            <div onClick={() => handleGoBack()} style={{ marginRight: 'auto' }}>
                                <ArrowBackIcon />
                            </div>
                            <div style={{ marginRight: 'auto' }}>
                                {dataKnowledge[0]?.Title}
                            </div>
                        </div>
                    </Layout>



                    <Form
                        layout="vertical"
                        name="form"
                        form={Addform}
                        onFinish={onFinish}
                        autoComplete="off"
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Form.Item name="Node1" label="Node 1" style={{ flexBasis: '20%', marginRight: '10px' }}>
                                <Select
                                    placeholder="Search"
                                    showSearch
                                    onSearch={handleSearchFact}
                                    filterOption={false}
                                >
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item: Fact) => (
                                            <Option key={item.ID} value={`${item.FactName} (${item.Description})`} >
                                                {item.FactName} ({item.Description})
                                            </Option>
                                        ))
                                    ) : (<Option> </Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item name="OperatorID" label="Operator" style={{ flexBasis: '10%', marginRight: '10px' }}>
                                <Select placeholder="Select operator" >
                                    {dataOperater.map((item) => (
                                        <Option value={item.ID} key={item.ID}>
                                            {`${item.OperatorName}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="Node2" label="Node 2" style={{ flexBasis: '20%' }}>
                                <Select
                                    placeholder="Search"
                                    showSearch
                                    onSearch={handleSearchFact}
                                    filterOption={false}
                                >
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item: Fact) => (
                                            <Option key={item.ID} value={`${item.FactName} (${item.Description})`}>
                                                {item.FactName} ({item.Description})
                                            </Option>
                                        ))
                                    ) : (<Option> </Option>)}
                                </Select>
                            </Form.Item>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Form.Item name="Result1" label="Result 1" style={{ flexBasis: '25%', marginRight: 10 }}>
                                <Select
                                    placeholder="Search"
                                    showSearch
                                    onSearch={handleSearchFact}
                                    filterOption={false}
                                >
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item: Fact) => (
                                            <Option key={item.ID} value={`${item.FactName} (${item.Description})`} >
                                                {item.FactName} ({item.Description})
                                            </Option>
                                        ))
                                    ) : (<Option> </Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item name="Result2" label="Result 2" style={{ flexBasis: '25%' }}>
                                <Select
                                    placeholder="Search"
                                    showSearch
                                    onSearch={handleSearchFact}
                                    filterOption={false}
                                >
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item: Fact) => (
                                            <Option key={item.ID} value={`${item.FactName} (${item.Description})`}>
                                                {item.FactName} ({item.Description})
                                            </Option>
                                        ))
                                    ) : (<Option> </Option>)}
                                </Select>
                            </Form.Item>
                        </div>


                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <Button htmlType="submit" style={{ marginRight: '10px' }}>
                                    SAVE RULE
                                </Button>
                            </div>
                            <div>
                                <Button onClick={handleResetFields}>
                                    RESET
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>

                <Card className=""
                    style={{ marginTop: '10px', textAlign: 'center' }}
                    title="THE TABLE LISTS THE RULES">
                    <Table
                        dataSource={dataRule}
                        columns={columns}
                        size="middle"
                        pagination={{ pageSize: 5 }}
                        rowKey={obj => obj.ID} />
                </Card>

                <Modal
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    title={<span style={{ color: '#FF4B4B', fontSize: 20 }}> คำเตือน !! </span>}
                    style={{ fontSize: '16px', minWidth: '400px' }}
                    okText={<span style={{ color: 'white' }}> ลบข้อมูล </span>}
                    okButtonProps={{ style: { background: '#0BB6DC', borderColor: '#0BB6DC' } }}
                    cancelText={<span style={{ color: 'white' }}> ยกเลิก </span>}
                    cancelButtonProps={{ style: { background: '#FF4B4B', borderColor: '#FF4B4B' } }}
                >
                    <p>{modalText}</p>
                </Modal>

                <Modal
                    open={openForEdit}
                    onOk={AddformForEdit.submit}
                    confirmLoading={confirmLoadingForEdit}
                    onCancel={handleCancelForEdit}
                    title={<span style={{ color: '#FF4B4B', fontSize: 20 }}> EDIT RULE </span>}
                    style={{ fontSize: '16px', minWidth: '400px' }}
                    okText={<span style={{ color: 'white' }}> update </span>}
                    okButtonProps={{ style: { background: '#0BB6DC', borderColor: '#0BB6DC' } }}
                    cancelText={<span style={{ color: 'white' }}> cancel </span>}
                    cancelButtonProps={{ style: { background: '#FF4B4B', borderColor: '#FF4B4B' } }}
                >
                    <Form form={AddformForEdit} onFinish={handleOkForEdit}>
                        <Form.Item
                            label="Node 1"
                            name="Node1"
                            // initialValue={editingRule?.Node1} // กำหนดค่า initialValue เป็นข้อมูล Node1 ของ rule ที่เลือก
                            initialValue={editingRule ? editingRule.Node1 : ''}
                            // rules={[{ required: true, message: 'Please input your Node 1!' }]}
                        >
                            <Select
                                placeholder="Search"
                                showSearch
                                onSearch={handleSearchFact}
                                filterOption={false}
                            >
                                {searchResults.length > 0 ? (
                                    searchResults.map((item: Fact) => (
                                        <Option key={item.ID} value={`${item.FactName} (${item.Description})`}>
                                            {item.FactName} ({item.Description})
                                        </Option>
                                    ))
                                ) : (
                                    <Option> </Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Operator"
                            name="OperatorID"
                            // initialValue={editingRule?.Operator?.OperatorName} // กำหนดค่า initialValue เป็นข้อมูล Node1 ของ rule ที่เลือก
                            initialValue={editingRule ? editingRule.OperatorID : ''}
                            // rules={[{ required: true, message: 'Please select your Operator!' }]}
                        >
                            <Select placeholder="Select operator">
                                {dataOperater.map((item) => (
                                    <Option value={item.ID} key={item.ID}>
                                        {`${item.OperatorName}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Node 2"
                            name="Node2"
                            // initialValue={editingRule?.Node2} // กำหนดค่า initialValue เป็นข้อมูล Node1 ของ rule ที่เลือก
                            initialValue={editingRule ? editingRule.Node2 : ''}
                            // rules={[{ required: true, message: 'Please input your Node 2!' }]}
                        >
                            <Select
                                placeholder="Search"
                                showSearch
                                onSearch={handleSearchFact}
                                filterOption={false}
                            >
                                {searchResults.length > 0 ? (
                                    searchResults.map((item: Fact) => (
                                        <Option key={item.ID} value={`${item.FactName} (${item.Description})`}>
                                            {item.FactName} ({item.Description})
                                        </Option>
                                    ))
                                ) : (
                                    <Option> </Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Result 1"
                            name="Result1"
                            // initialValue={editingRule?.Result1} // กำหนดค่า initialValue เป็นข้อมูล Node1 ของ rule ที่เลือก
                            initialValue={editingRule ? editingRule.Result1 : ''}
                            // rules={[{ required: true, message: 'Please input your Result 1!' }]}
                        >
                            <Select
                                placeholder="Search"
                                showSearch
                                onSearch={handleSearchFact}
                                filterOption={false}
                            >
                                {searchResults.length > 0 ? (
                                    searchResults.map((item: Fact) => (
                                        <Option key={item.ID} value={`${item.FactName} (${item.Description})`}>
                                            {item.FactName} ({item.Description})
                                        </Option>
                                    ))
                                ) : (
                                    <Option> </Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Result 2"
                            name="Result2"
                            // initialValue={editingRule?.Result2} // กำหนดค่า initialValue เป็นข้อมูล Node1 ของ rule ที่เลือก
                            initialValue={editingRule ? editingRule.Result2 : ''}
                            // rules={[{ required: true, message: 'Please input your Result 2!' }]}
                        >
                            <Select
                                placeholder="Search"
                                showSearch
                                onSearch={handleSearchFact}
                                filterOption={false}
                            >
                                {searchResults.length > 0 ? (
                                    searchResults.map((item: Fact) => (
                                        <Option key={item.ID} value={`${item.FactName} (${item.Description})`}>
                                            {item.FactName} ({item.Description})
                                        </Option>
                                    ))
                                ) : (
                                    <Option> </Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <ToastContainer position="top-center" autoClose={3000} />
                <Footers />
            </Content>
        </>
    );
}
