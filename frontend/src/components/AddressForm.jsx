import { useState, useEffect } from "react";
import provinceData from "../data/thailand/address/provinces.json";
import districtData from "../data/thailand/address/districts.json";
import subDistrictData from "../data/thailand/address/subdistricts.json";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const AddressForm = ({ onChange, initialData }) => {

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
    const [postalCode, setPostalCode] = useState("");

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subDistricts, setSubDistricts] = useState([]);

    const [addressData, setAddressData] = useState({
        province: "",
        district: "",
        subdistrict: "",
        postal_code: "",
        latitude: "",
        longitude: "",
        information: "",
    });

    const [position, setPosition] = useState({ lat: 15.8700, lng: 100.9925 }); // ตำแหน่งเริ่มต้นของ Marker
    const [showMap, setShowMap] = useState(false); // state เพื่อควบคุมการแสดงแผนที่

    // ตั้งค่าข้อมูลเริ่มต้นเมื่อโหลดคอมโพเนนต์
    useEffect(() => {
        setProvinces(provinceData);

        if (initialData) {
            setAddressData(initialData);

            const province = provinceData.find((p) => p.provinceNameTh === initialData.province);
            if (province) {
                setSelectedProvince(province);
                const filteredDistricts = districtData.filter((d) => d.provinceCode === province.provinceCode);
                setDistricts(filteredDistricts);

                const district = filteredDistricts.find((d) => d.districtNameTh === initialData.district);
                if (district) {
                    setSelectedDistrict(district);
                    const filteredSubDistricts = subDistrictData.filter((s) => s.districtCode === district.districtCode);
                    setSubDistricts(filteredSubDistricts);

                    const subDistrict = filteredSubDistricts.find((s) => s.subdistrictNameTh === initialData.subdistrict);
                    if (subDistrict) {
                        setSelectedSubDistrict(subDistrict);
                        setPostalCode(subDistrict.postalCode);
                    }
                }
            }
        }
    }, [initialData]);

    // ตรวจสอบว่าข้อมูลครบถ้วนและแสดงแผนที่
    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedSubDistrict && postalCode) {
            setShowMap(true); // แสดงแผนที่เมื่อข้อมูลครบถ้วน
        }
    }, [selectedProvince, selectedDistrict, selectedSubDistrict, postalCode]);

    const updateAddress = (newData) => {
        const updatedData = { ...addressData, ...newData };
        setAddressData(updatedData);
        if (onChange) onChange(updatedData);
    };

    const handleProvinceChange = (provinceCode) => {
        const province = provinces.find((p) => p.provinceCode === parseInt(provinceCode));
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedSubDistrict(null);
        setPostalCode("");

        setDistricts(districtData.filter((d) => d.provinceCode === parseInt(provinceCode)));

        updateAddress({ province: province?.provinceNameTh || "", district: "", subdistrict: "", postal_code: "" });
    };

    const handleDistrictChange = (districtCode) => {
        const district = districts.find((d) => d.districtCode === parseInt(districtCode));
        setSelectedDistrict(district);
        setSelectedSubDistrict(null);
        setPostalCode("");

        setSubDistricts(subDistrictData.filter((s) => s.districtCode === parseInt(districtCode)));

        updateAddress({ district: district?.districtNameTh || "", subdistrict: "", postal_code: "" });
    };

    const handleSubDistrictChange = (subdistrictCode) => {
        const subDistrict = subDistricts.find((s) => s.subdistrictCode === parseInt(subdistrictCode));
        setSelectedSubDistrict(subDistrict);
        setPostalCode(subDistrict?.postalCode || "");

        updateAddress({ subdistrict: subDistrict?.subdistrictNameTh || "", postal_code: subDistrict?.postalCode || "" });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        updateAddress({ [name]: value });
    };

    // ฟังก์ชันที่เรียกเมื่อ Marker ถูกย้าย
    const handleDragEnd = (event) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPosition(newPosition); // อัปเดตตำแหน่งใหม่
        updateAddress({ latitude: newPosition.lat, longitude: newPosition.lng }); // อัปเดตตำแหน่งใน addressData
    };

    const ShowMap = () => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        return (
            <APIProvider apiKey={apiKey}>
                <Map
                    style={{ width: '100%', height: '30vh' }}
                    defaultCenter={position}
                    defaultZoom={9}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    {/* ใช้ Marker ที่ขยับได้ */}
                    <Marker
                        position={position}
                        draggable={true} // ทำให้ Marker ขยับได้
                        onDragEnd={handleDragEnd} // เรียกฟังก์ชันเมื่อ Marker ถูกย้าย
                    />
                </Map>
            </APIProvider>
        );
    };

    return (
        <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Address</label>
            <div className="space-y-4">
                <div className="flex items-center">
                    <label className="w-24 text-gray-700">Province:</label>
                    <select 
                        value={selectedProvince?.provinceCode || ""} 
                        onChange={(e) => handleProvinceChange(e.target.value)} 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    >
                        <option value="">Please Select</option>
                        {provinces.map((p) => (
                            <option key={p.provinceCode} value={p.provinceCode}>
                                {p.provinceNameTh} ({p.provinceNameEn})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="w-24 text-gray-700">District:</label>
                    <select 
                        value={selectedDistrict?.districtCode || ""} 
                        onChange={(e) => handleDistrictChange(e.target.value)} 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500" 
                        disabled={!selectedProvince}
                    >
                        <option value="">Select Province</option>
                        {districts.map((d) => (
                            <option key={d.districtCode} value={d.districtCode}>
                                {d.districtNameTh} ({d.districtNameEn})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="w-24 text-gray-700">Sub-District:</label>
                    <select 
                        value={selectedSubDistrict?.subdistrictCode || ""} 
                        onChange={(e) => handleSubDistrictChange(e.target.value)} 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500" 
                        disabled={!selectedDistrict}
                    >
                        <option value="">Select District</option>
                        {subDistricts.map((s) => (
                            <option key={s.subdistrictCode} value={s.subdistrictCode}>
                                {s.subdistrictNameTh} ({s.subdistrictNameEn})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="w-24 text-gray-700">Postal Code:</label>
                    <input 
                        type="text" 
                        value={postalCode || "Please select sub-district"} 
                        readOnly 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 bg-gray-200 text-gray-500" 
                    />
                </div>
                {/* <div className="flex items-center">
                    <label className="w-24 text-gray-700">Latitude:</label>
                    <input 
                        type="number" 
                        name="latitude" 
                        value={addressData.latitude} 
                        onChange={handleAddressChange} 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500" 
                        placeholder="Enter latitude" 
                        required 
                    />
                </div>
                <div className="flex items-center">
                    <label className="w-24 text-gray-700">Longitude:</label>
                    <input 
                        type="number" 
                        name="longitude" 
                        value={addressData.longitude} 
                        onChange={handleAddressChange} 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500" 
                        placeholder="Enter longitude" 
                        required 
                    />
                </div> */}

                <div className="flex items-center">
                    <label className="w-24 text-gray-700">Information:</label>
                    <input 
                        type="text" 
                        name="information" 
                        value={addressData.information} 
                        onChange={handleAddressChange} 
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500" 
                        placeholder="Enter additional information" 
                    />
                </div>

                {/* แสดงแผนที่ถ้า showMap เป็น true */}
                {showMap && <ShowMap />}
            </div>
        </div>
    );
};

export default AddressForm;