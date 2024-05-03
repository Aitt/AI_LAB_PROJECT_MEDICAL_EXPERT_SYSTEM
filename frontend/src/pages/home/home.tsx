import { Content } from "antd/es/layout/layout";
import Footers from "../../layout/footer";
import Narbar from "../../layout/forUser/UserNav";
import Chatbot from "../../components/Chatbot/Chatbot1";
import { Card } from "antd";

export default function Home() {

    return (
        <>
        <Narbar/>
            <Content style={{
                padding:'20px', 
                height:'80vh' ,
                backgroundColor:'darkgrey',
                textAlign:'center',
                alignContent:'center',
                }}>
                    
                <Card style={{width:'80vw', marginLeft:'auto', marginRight:'auto'}}>
                    <Chatbot/>
                </Card>  
            </Content>
        <Footers/>
        </>
    );
}
