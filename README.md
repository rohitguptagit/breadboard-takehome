
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
