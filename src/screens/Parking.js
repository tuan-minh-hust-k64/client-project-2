import { Button, Image, Input, Modal, notification, Radio, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { socket } from "../socket/index ";



const Parking = () => {
    const param = useParams();
    const navigation = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [value, setValue] = useState(1);
    const [slotId, setSlotId] = useState(-1);
    const [image, setImage] = useState('');
    const [imageDefault, setImageDefault] = useState('');
    const [showDefault, setShowDefault] = useState(true);
    const [slots, setSlots] = useState('Loading...');

    useEffect(() => {
        socket.connect();
        // socket.emit('join')
        socket.on('default', (body) => {
            setImageDefault(body.default_path);
            if(showDefault){
                setSlots(body.num_vacant_space);
            }
        })
        socket.on('data_comming', (body) => {
            if(showDefault){
                setShowDefault(false);
            }
            setImage(body.path);
            setSlots(body.num_vacant_space);
        })
        socket.on('test', (data) => {
            console.log(data)
        })
        return () => {
            socket.disconnect(); 
        }
    }, [])
    // const getData = async () => {
    //     return await axios.get("http://localhost:8080/name")
    // }
    // useEffect(() => {
    //     // getData().then((response) => {
    //     //     setImage(response.data);
    //     // })
    //     setTimeout(() => {
    //         setImage("https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp");
    //     }, 3000);
    //     setTimeout(() => {
    //         setImage("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");
    //     }, 5000);

    // }, [])



    const onChange = (e) => {
        setValue(e.target.value);

    }
    const handleOk = useCallback(() => {
        setIsModalVisible(false);
        if (value === 1) {
            socket.emit('join')
            const userId = uuidv4();
            const parkingsOld = JSON.parse(localStorage.getItem('parkings')) || [];
            parkingsOld.push({
                userId: userId,
                Id: param.id,
                Name: param.name,
                start: Date.now(),
            })
            localStorage.setItem('parkings', JSON.stringify(parkingsOld))
        }
        if (value === 3) {
            info();
        }
        if (value === 2) {
            const parkingsOld = JSON.parse(localStorage.getItem('parkings')) || [];
            let userId;
            const newParkings = parkingsOld.filter(parking => {
                if (parking.Id !== param.id) {
                    return true;
                } else {
                    userId = parking.userId;
                    return false;
                }
            });
            localStorage.setItem('parkings', JSON.stringify(newParkings));
            socket.disconnect();
            navigation('/');
        }
    }, [value]);

    const handleCancel = () => {
        navigation('/')
    };

    const getState = () => {
        const parkings = JSON.parse(localStorage.getItem('parkings')) || [];
        const check = parkings.find(parking => parking.Id === param.id);
        return check !== undefined;
    }

    const info = () => {
        const parkings = JSON.parse(localStorage.getItem('parkings')) || [];
        const check = parkings.find(parking => parking.Id === param.id);
        const date = new Date(check.start);

        Modal.info({
            title: 'Th??ng tin thanh to??n',
            content: (
                <div>
                    <p>Th???i gian v??o: {date.toDateString()}</p>
                    <p>B???ng gi??: 30.000??/ng??y</p>
                    <p>S??? ti???n b???n ph???i tr??? l??: {((new Date().getTime() - check.start)/86400000)*30000}??</p>
                </div>
            ),
            onOk() {
                setIsModalVisible(true);
            },
        });
    };

    const onSearch = (value) => console.log(value);

    return (
        <div>
            <Modal title="Vui l??ng ch???n ????? ti???p t???c" maskClosable={false} closable={false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1} disabled={getState()} >V??o b??i</Radio>
                    <Radio value={2} disabled={!getState()} >R???i b??i</Radio>
                    <Radio value={3} disabled={!getState()}>Thanh to??n</Radio>
                </Radio.Group>
            </Modal>
            <h1>
                Welcome To Parking {param.name}
            </h1>
            <hr />
            <div style={{}}>
                <Input.Group compact>
                    <Input
                        style={{
                            width: '15rem',
                        }}
                        placeholder="Nh???p ID ch??? tr???ng (T??y ch???n)..."
                        onChange={(e) => {
                            setSlotId(parseInt(e.target.value, 10));
                        }}
                    />
                    <Button type="primary" onClick={() => {
                        const parkings = JSON.parse(localStorage.getItem('parkings')) || [];
                        const user = parkings.find(parking => parking.Id === param.id)
                        socket.emit('select_slot', { userId: user.userId, parking_id: param.id, slot_id: slotId }, (error) => {
                            alert(error)
                        })
                    }}> G???i</Button>
                </Input.Group>
                <h3 style={{marginTop: '2rem'}}>S??? v??? tr?? tr???ng:{slots} </h3>
                <Spin spinning={!image && !imageDefault}>
                    <div style={{ marginTop: "3rem" }}>
                        <Image
                            width={"40%"}
                            src={showDefault?imageDefault: image}
                        />
                    </div>
                </Spin>
            </div>
        </div >
    )
};
const openNotificationWithIcon = (type) => {
    notification[type]({
        message: 'Warning!',
        description:
            'Vui l??ng ch???n ????? ti???p t???c!',
    });
};
export default Parking;