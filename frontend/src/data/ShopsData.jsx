export const shops = [
    {
      owner_id: "1",
      shop_name: "Muay Thai Shop",
      logo_url: new URL("../assets/images/Shop_logo1.jpg", import.meta.url).href,
      description: "We offer the best Muay Thai gear in Phuket.",
      contacts: {
        email: "muaythaishop@gmail.com",
        tel: "089-xxx-xxxx",
        line: "muaythailine",
        facebook: "muaythaiFB",
      },
      address: {
        province: "Phuket",
        district: "Mueang",
        subdistrict: "Talad Yai",
        street: "Fight St.",
        postal_code: "83000",
        latitude: "7.884",
        longitude: "98.391",
        information: "Open at 9 to 5",
      },
    },
    {
      owner_id: "2",
      shop_name: "Thai Boxing Gear",
      logo_url: new URL("../assets/images/Shop_logo2.jpg", import.meta.url).href,
      description: "Your one-stop shop for Thai Boxing equipment.",
      contacts: {
        email: "boxinggear@gmail.com",
        tel: "090-xxx-xxxx",
        line: "boxingline",
        facebook: "boxingFB",
      },
      address: {
        province: "Bangkok",
        district: "Siam",
        subdistrict: "Siam Square",
        street: "Boxing St.",
        postal_code: "10110",
        latitude: "13.7563",
        longitude: "100.5018",
        information: "Open 24 hours",
      },
    },
  ];
  