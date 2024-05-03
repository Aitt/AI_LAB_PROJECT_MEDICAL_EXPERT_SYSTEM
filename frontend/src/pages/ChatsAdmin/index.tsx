import { Content } from "antd/es/layout/layout";
import Footers from "../../layout/footer";
import Nav from "../../layout/navbar";
// import Chatbot from "../../components/Chatbot/Chatbot";
import { Card } from "antd";
import Chatbot1 from "../../components/Chatbot/Chatbot1";

export default function ChatsAdmin() {

    return (
        <>
        <Nav/>
            <Content style={{
                padding:'20px', 
                height:'80vh' ,
                backgroundColor:'darkgrey',
                textAlign:'center',
                alignContent:'center',
                }}>
                    
                <Card style={{width:'80vw', marginLeft:'auto', marginRight:'auto'}}>
                    <Chatbot1/>
                </Card>  
            </Content>
        <Footers/>
        </>
    );
}
