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
    useEffect(() => {
        socket.connect();
        // socket.emit('join')
        socket.on('data_comming', (body) => {
            setImage(body.path);
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
            title: 'Thông tin thanh toán',
            content: (
                <div>
                    <p>Thời gian vào: {date.toDateString()}</p>
                    <p>Số tiền bạn phải trả là: ...</p>
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
            <Modal title="Vui lòng chọn để tiếp tục" maskClosable={false} closable={false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1} disabled={getState()} >Vào bãi</Radio>
                    <Radio value={2} disabled={!getState()} >Rời bãi</Radio>
                    <Radio value={3} disabled={!getState()}>Thanh toán</Radio>
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
                        placeholder="Nhập ID chỗ trống (Tùy chọn)..."
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
                    }}> Gửi</Button>
                </Input.Group>
                <Spin spinning={!image}>
                    <div style={{ marginTop: "3rem" }}>
                        <Image
                            width={"40%"}
                            src={image}
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
            'Vui lòng chọn để tiếp tục!',
    });
};
export default Parking;