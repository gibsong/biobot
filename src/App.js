import React, { useState } from "react";
import AsyncSelect from 'react-select/async';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const API_BASE_KIT_URL = "http://localhost:9000/api/v1/kit"
    const API_BASE_KITS_URL = "http://localhost:9000/api/v1/kits"
    const INITIAL_VALUE = ""

    const HEADERS = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }

    const [kit, setKit] = useState(INITIAL_VALUE)
    const [kitID, setkitID] = useState(INITIAL_VALUE);


    const loadOptions = (kitID) => {
        const url = `${API_BASE_KITS_URL}?kitID=${kitID}`
        return fetch(url, HEADERS).then(res => res.json()).catch((error) => {
            console.error('Load Options Error:', error);
        });
    }

    const handleChange = (selected) => {
        setkitID(selected.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = `${API_BASE_KIT_URL}?kitID=${kitID}`

        fetch(url, HEADERS)
            .then(res => res.json())
            .then(json => {
                setKit({id: json.id, label_id: json.label_id, shipping_tracking_code: json.shipping_tracking_code})
            })
            .catch((error) => {
                console.error('handleSubmit Error:', error);
            });
    }

    let searchResult = (
      <div>
        <div>ID: {kit.id}</div>
        <div>Label: {kit.label_id}</div>
        <div>Shipping Tracking Code: {kit.shipping_tracking_code}</div>
      </div>
    )

    return (
    <div className="container">

        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-1 offset-3 pt-2">
                    <label>Kit ID:</label>
                </div>
                <div className="col-4 pt-1">
                    <AsyncSelect
                        onChange={handleChange}
                        loadOptions={loadOptions}
                        placeholder={"enter kit id"}
                    />
                </div>
                <div className="col-1 pt-2">
                    <input type="submit" value="Search" />
                </div>
            </div>
        </form>

        <div className="row">
            <div className="col-4 offset-4">
                {kit && searchResult}
            </div>
        </div>

    </div>
    );
}

export default App;
