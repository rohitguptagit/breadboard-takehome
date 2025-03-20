
# Part Aggregator API

This is a **Nest.js** REST API that aggregates electronic part data from multiple supplier endpoints and returns a combined response with comprehensive details for part number `0510210200`.

---

## 🚀 Features
- Aggregates data from two supplier APIs (Arrow and TTI)
- Returns detailed part information, including:
  - Part Name
  - Description
  - Total Stock
  - Manufacturer Lead Time
  - Manufacturer Name
  - Packaging Details
  - Product Documentation URL
  - Product Image URL
  - Source Supplier(s)
- Data is automatically **pretty-printed** in the browser

---

## 📦 Installation
1. **Clone the Repository**
```bash
git clone <repository-url>
cd part-aggregator
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create a `.env` File** (Optional if environment variables are needed)
```
PORT=3000
```

4. **Run the Development Server**
```bash
npm run start:dev
```

---

## ⚙️ Usage
Once the server is running, you can query the API endpoint:

### **GET Endpoint:**
```
GET http://localhost:3000/parts/aggregate?partNumber=0510210200
```

### ✅ Sample Response (Prettified JSON in Browser)
```json
{
    "name": "Connector",
    "description": "Molex Connector 2-Pin",
    "totalStock": 5000,
    "manufacturerLeadTime": 10,
    "manufacturerName": "Molex",
    "packaging": [
        {
            "type": "Reel",
            "minimumOrderQuantity": 100,
            "quantityAvailable": 2000,
            "unitPrice": 0.5,
            "supplier": "Arrow",
            "priceBreaks": [
                { "breakQuantity": 100, "unitPrice": 0.45, "totalPrice": 45 }
            ]
        },
        {
            "type": "Bulk",
            "minimumOrderQuantity": 50,
            "quantityAvailable": 3000,
            "unitPrice": 0.55,
            "supplier": "TTI",
            "priceBreaks": [
                { "breakQuantity": 50, "unitPrice": 0.5, "totalPrice": 25 }
            ]
        }
    ],
    "productDoc": "https://example.com/datasheet.pdf",
    "productUrl": "https://example.com/product",
    "productImageUrl": "https://example.com/image.jpg",
    "specifications": {},
    "sourceParts": ["Arrow", "TTI"]
}
```

---

## 🧪 Testing
To run tests (if applicable):
```bash
npm run test
```

---

## 🛠️ Project Structure
```
src/
├── parts/
│   ├── dto/
│   │   └── aggregated-part.dto.ts
│   ├── parts.controller.ts
│   ├── parts.module.ts
│   ├── parts.service.ts
├── app.module.ts
├── main.ts
```

---

## 🧩 Dependencies
- **Nest.js** - Core framework
- **Axios** - For making HTTP requests to supplier endpoints

---

## ❗ Troubleshooting
- **Port Already in Use Error:** Run `lsof -i :3000` to identify the process and terminate it.
- **Data Not Displaying Correctly:** Ensure mock data endpoints are accessible and functional.

---

## 🤝 Contributing
If you'd like to contribute, feel free to submit a pull request or raise an issue.

---

## 📄 License
This project is licensed under the **MIT License**.

---

## 📞 Contact
For inquiries, feel free to reach out via email or through GitHub.
