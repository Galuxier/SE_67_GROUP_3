import { useState, useEffect, useMemo } from "react";
import provinceData from "../../data/thailand/address/provinces.json";
import districtData from "../../data/thailand/address/districts.json";
import subDistrictData from "../../data/thailand/address/subdistricts.json";

const AddressForm = ({ onChange, initialData = {} }) => {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
    const [postalCode, setPostalCode] = useState("");
    const [postalCodes, setPostalCodes] = useState([]);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subDistricts, setSubDistricts] = useState([]);

    const [addressData, setAddressData] = useState({
        province: initialData.province || "",
        district: initialData.district || "",
        subdistrict: initialData.subdistrict || "",
        postal_code: initialData.postal_code || "",
        information: initialData.information || "",
    });

    // Initialize component with data
    useEffect(() => {
        setProvinces(provinceData);

        if (initialData && Object.keys(initialData).length > 0) {
            setAddressData(initialData);
            
            // Find and set province if it exists
            if (initialData.province) {
                const province = provinceData.find(p => p.provinceNameTh === initialData.province);
                if (province) {
                    setSelectedProvince(province);
                    
                    // Filter districts for selected province
                    const filteredDistricts = districtData.filter(d => d.provinceCode === province.provinceCode);
                    setDistricts(filteredDistricts);
                    
                    // Find and set district if it exists
                    if (initialData.district && filteredDistricts.length > 0) {
                        const district = filteredDistricts.find(d => d.districtNameTh === initialData.district);
                        if (district) {
                            setSelectedDistrict(district);
                            
                            // Filter subdistricts for selected district
                            const filteredSubDistricts = subDistrictData.filter(s => s.districtCode === district.districtCode);
                            setSubDistricts(filteredSubDistricts);
                            
                            // Find and set subdistrict if it exists
                            if (initialData.subdistrict && filteredSubDistricts.length > 0) {
                                const subDistrict = filteredSubDistricts.find(s => s.subdistrictNameTh === initialData.subdistrict);
                                if (subDistrict) {
                                    setSelectedSubDistrict(subDistrict);
                                    
                                    // Update postal codes and set postal code
                                    const codes = [...new Set(filteredSubDistricts.map(s => s.postalCode))];
                                    setPostalCodes(codes);
                                    
                                    if (initialData.postal_code) {
                                        setPostalCode(initialData.postal_code);
                                    } else if (codes.length > 0) {
                                        setPostalCode(codes[0]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, [initialData]);

    // Helper function to update address state and call onChange
    const updateAddress = (newData) => {
        const updatedData = { ...addressData, ...newData };
        setAddressData(updatedData);
        if (onChange) onChange(updatedData);
    };

    // Province change handler
    const handleProvinceChange = (provinceCode) => {
        const province = provinces.find(p => p.provinceCode === parseInt(provinceCode));
        
        // Reset dependent fields
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedSubDistrict(null);
        setPostalCode("");
        setPostalCodes([]);
        
        // Update districts based on selected province
        const filteredDistricts = districtData.filter(d => d.provinceCode === parseInt(provinceCode));
        setDistricts(filteredDistricts);
        
        // Update address data
        updateAddress({
            province: province?.provinceNameTh || "",
            district: "",
            subdistrict: "",
            postal_code: ""
        });
    };

    // District change handler
    const handleDistrictChange = (districtCode) => {
        const district = districts.find(d => d.districtCode === parseInt(districtCode));
        
        // Reset dependent fields
        setSelectedDistrict(district);
        setSelectedSubDistrict(null);
        setPostalCode("");
        setPostalCodes([]);
        
        // Update subdistricts based on selected district
        const filteredSubDistricts = subDistrictData.filter(s => s.districtCode === parseInt(districtCode));
        setSubDistricts(filteredSubDistricts);
        
        // Update address data
        updateAddress({
            district: district?.districtNameTh || "",
            subdistrict: "",
            postal_code: ""
        });
    };

    // Subdistrict change handler
    const handleSubDistrictChange = (subdistrictCode) => {
        const subDistrict = subDistricts.find(s => s.subdistrictCode === parseInt(subdistrictCode));
        
        setSelectedSubDistrict(subDistrict);
        
        // Update postal codes
        updatePostalCodes(subDistricts);
        
        if (subDistrict) {
            setPostalCode(subDistrict.postalCode || "");
            updateAddress({
                subdistrict: subDistrict.subdistrictNameTh || "",
                postal_code: subDistrict.postalCode || ""
            });
        }
    };

    // Postal code change handler
    const handlePostalCodeChange = (e) => {
        const code = e.target.value;
        setPostalCode(code);
        updateAddress({ postal_code: code });
    };

    // Additional information change handler
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        updateAddress({ [name]: value });
    };

    // Update postal codes based on subdistricts
    const updatePostalCodes = (subDistricts) => {
        const codes = [...new Set(subDistricts.map(s => s.postalCode))];
        setPostalCodes(codes);
        
        if (codes.length > 0) {
            setPostalCode(codes[0]);
            updateAddress({ postal_code: codes[0] });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <label className="w-24 text-text">Province:</label>
                <select 
                    value={selectedProvince?.provinceCode || ""} 
                    onChange={(e) => handleProvinceChange(e.target.value)} 
                    className="flex-1 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
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
                <label className="w-24 text-text">District:</label>
                <select 
                    value={selectedDistrict?.districtCode || ""} 
                    onChange={(e) => handleDistrictChange(e.target.value)} 
                    className="flex-1 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
                    disabled={!selectedProvince}
                >
                    <option value="">Select Province First</option>
                    {districts.map((d) => (
                        <option key={d.districtCode} value={d.districtCode}>
                            {d.districtNameTh} ({d.districtNameEn})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center">
                <label className="w-24 text-text">Sub-District:</label>
                <select 
                    value={selectedSubDistrict?.subdistrictCode || ""} 
                    onChange={(e) => handleSubDistrictChange(e.target.value)} 
                    className="flex-1 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
                    disabled={!selectedDistrict}
                >
                    <option value="">Select District First</option>
                    {subDistricts.map((s) => (
                        <option key={s.subdistrictCode} value={s.subdistrictCode}>
                            {s.subdistrictNameTh} ({s.subdistrictNameEn})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center">
                <label className="w-24 text-text">Postal Code:</label>
                <select
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    disabled={!postalCodes.length}
                    className="flex-1 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
                >
                    {postalCodes.length === 0 ? (
                        <option value="">Select Sub-District First</option>
                    ) : (
                        postalCodes.map((code) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="flex items-center">
                <label className="w-24 text-text">Detail:</label>
                <input 
                    type="text" 
                    name="information" 
                    value={addressData.information || ""} 
                    onChange={handleAddressChange} 
                    className="flex-1 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
                    placeholder="Street, house number, or additional information" 
                />
            </div>
        </div>
    );
};

export default AddressForm;