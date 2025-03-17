/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import provinceData from "../data/thailand/address/provinces.json";
import districtData from "../data/thailand/address/districts.json";
import subDistrictData from "../data/thailand/address/subdistricts.json";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const AddressForm = ({ onChange, initialData }) => {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
    const [postalCode, setPostalCode] = useState("");
    const [postalCodes, setPostalCodes] = useState([]);

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

    const [position, setPosition] = useState({ lat: 15.8700, lng: 100.9925 }); // Thailand center
    const [zoom, setZoom] = useState(15);
    const [showMap, setShowMap] = useState(false);

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
                        updatePostalCodes(filteredSubDistricts);
                        setPostalCode(subDistrict.postalCode);
                    }
                }
            }
        }
    }, [initialData]);

    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedSubDistrict && postalCode) {
            geocodeAddress();
            setShowMap(true);
        }
    }, [selectedProvince, selectedDistrict, selectedSubDistrict, postalCode]);

    const geocodeAddress = async () => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const address = `${selectedSubDistrict.subdistrictNameTh}, ${selectedDistrict.districtNameTh}, ${selectedProvince.provinceNameTh} ${postalCode}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                const location = data.results[0].geometry.location;
                setPosition(location);
                updateAddress({ latitude: location.lat, longitude: location.lng });
                setZoom(16);
            }
        } catch (error) {
            console.error("Geocode error:", error);
        }
    };

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
        setPostalCodes([]);

        setDistricts(districtData.filter((d) => d.provinceCode === parseInt(provinceCode)));
        updateAddress({ province: province?.provinceNameTh || "", district: "", subdistrict: "", postal_code: "" });
    };

    const handleDistrictChange = (districtCode) => {
        const district = districts.find((d) => d.districtCode === parseInt(districtCode));
        setSelectedDistrict(district);
        setSelectedSubDistrict(null);
        setPostalCode("");
        setPostalCodes([]);

        const filteredSubDistricts = subDistrictData.filter((s) => s.districtCode === parseInt(districtCode));
        setSubDistricts(filteredSubDistricts);
        updateAddress({ district: district?.districtNameTh || "", subdistrict: "", postal_code: "" });
    };

    const handleSubDistrictChange = (subdistrictCode) => {
        const subDistrict = subDistricts.find((s) => s.subdistrictCode === parseInt(subdistrictCode));
        setSelectedSubDistrict(subDistrict);
        updatePostalCodes(subDistricts);
        setPostalCode(subDistrict?.postalCode || "");

        updateAddress({ subdistrict: subDistrict?.subdistrictNameTh || "", postal_code: subDistrict?.postalCode || "" });
    };

    const updatePostalCodes = (subDistricts) => {
        const codes = [...new Set(subDistricts.map((s) => s.postalCode))];
        setPostalCodes(codes);
        if (codes.length > 0) {
            setPostalCode(codes[0]); // ตั้งค่า postalCode เป็นค่าแรกในรายการ
            updateAddress({ postal_code: codes[0] });
        }
    };

    const handlePostalCodeChange = (e) => {
        const code = e.target.value;
        setPostalCode(code);
        updateAddress({ postal_code: code });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        updateAddress({ [name]: value });
    };

    const mapComponent = useMemo(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        return (
            <APIProvider apiKey={apiKey}>
                <Map
                    style={{ width: '100%', height: '30vh' }}
                    center={position}
                    zoom={zoom}
                >
                    <Marker
                        position={position}
                        draggable
                        onDragEnd={(e) => setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                    />
                </Map>
            </APIProvider>
        );
    }, [position, zoom]);

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
                    <select
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        disabled={!postalCodes.length}
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    >
                        {postalCodes.map((code) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>
                </div>

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

                {/* {showMap && mapComponent} */}
            </div>
        </div>
    );
};

export default AddressForm;