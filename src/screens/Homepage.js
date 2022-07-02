import { Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Option = Select;
const HomePage = () => {
    const [parkings, setParkings] = useState([{Id: 1, Name: "HUST"}, {Id: 2, Name: "NEU"}, {Id:3, Name: "NUCE"}]);
    // const getData = async () => {
    //     return await axios.get('http://localhost:8080/api/data');
    // }
    const navigation = useNavigate();
    
    // useEffect(() => {
    //     getData().then((response) => {
    //         setParkings(response.data.data)
    //     })
    // }, [])

    const selectParking = (Id) => {
        const name = parkings.find(parking => parking.Id === Id).Name;
        navigation(`/parking/${name}/${Id}`);
    }
    

    return (
        <div>
            <h1>Smart Parking System</h1>
            <hr />
            <h3>Vui lòng lựa chọn bãi đỗ xe:</h3>
            <Select
                showSearch
                style={{
                    width: 200,
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.includes(input)}
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                onChange={(e) => selectParking(e)}
            >
                {
                    parkings.map(parking => {
                        return (
                            <Option value={parking.Id} key={parking.Id}>{parking.Name}</Option>
                        )
                    })
                }
            </Select>
        </div>

    )
}
export default HomePage;