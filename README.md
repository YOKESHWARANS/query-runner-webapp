# 🚀 SQL Query Viewer

SQL Query Viewer is a powerful web-based application designed for data analysts and developers to explore, execute, and visualize SQL queries interactively. With an intuitive UI and advanced visualization features, it enhances data exploration and performance monitoring.

---

## 🛠️ Project Need

Data analysts frequently require a quick and interactive way to execute SQL queries and visualize results without the hassle of setting up complex database environments. Existing solutions either demand backend integration or lack an intuitive user experience, making real-time data exploration inefficient.

The objective is to develop a frontend-based **SQL Query Viewer** that:

- Allows users to write and execute SQL-like queries effortlessly.
- Provides multiple visualization options such as tables, bar charts, and pie charts.
- Tracks key performance metrics like query execution time and data load efficiency.
- Maintains a structured history of queries for easy re-execution.
- Enables seamless data export for external usage and analysis.

This project aims to bridge the gap between SQL query execution and user-friendly data visualization, enhancing productivity for data professionals.

---

## 📜 Features

✅ Execute Predefined & Custom SQL Queries  
✅ Interactive Data Visualization (Bar, Line, Pie, Area, and Scatter Charts)  
✅ Query Performance Tracking  
✅ Query History & CSV Export  
✅ Theme Switching (Dark/Light Mode)  

---

## 📈 System Design

### **1️⃣ Overview**
SQL Query Viewer is a **frontend-focused application** that executes and visualizes SQL queries without requiring a full database backend.

### **2️⃣ Architecture**
The application follows a **component-based architecture** built with React.js, ensuring modularity, reusability, and scalability.

#### Key Layers:
1. **Presentation Layer (React.js)** – Manages UI rendering and user interactions.
2. **Logic Layer** – Processes SQL-like queries, generates mock data, and manages state.
3. **Storage Layer (Local Storage)** – Saves query history and user preferences (e.g., theme selection).

### **3️⃣ Component Breakdown**

- **App.js** – Main entry point, managing global state.
- **QuerySelector.js** – Handles predefined and custom query selection.
- **CustomQueryInput.js** – Enables writing and validating custom queries.
- **ResultsTable.js** – Displays query execution results.
- **DataVisualization.js** – Converts results into interactive charts.
- **PerformanceTracker.js** – Tracks execution time and memory usage.
- **QueryHistory.js** – Stores past queries for easy access.
- **SQLSyntaxHighlighter.js** – Enhances SQL readability with syntax highlighting.
- **ThemeProvider.js & ThemeToggle.js** – Implements Light/Dark mode.

### **4️⃣ Data Flow**

1. User selects a predefined query or enters a custom query.
2. Query validation ensures correctness.
3. Mock data is generated based on the query.
4. Results are displayed in both a table and charts.
5. Performance metrics are tracked.
6. Query history is updated for later reference.
7. Results can be exported as CSV.
8. User preferences are stored in Local Storage.

### **5️⃣ Performance Optimizations**

- **Lazy Loading** – Loads components only when needed.
- **Memoization** – Uses `useMemo` and `useCallback` for efficiency.
- **Error Boundaries** – Ensures stability in case of failures.![Screenshot 2025-03-31 151514](https://github.com/user-attachments/assets/e0b492c0-cfb3-4d72-915e-e7daaa3d3941)
![Screenshot 2025-03-31 151458](https://github.com/user-attachments/assets/faa98c42-f326-4488-8847-c932a859f112)
![Screenshot 2025-03-31 151837](https://github.com/user-attachments/assets/c3fae2d1-3275-42cf-a31c-ce03c98271d2)
![Perfomance Analysis UI](https://github.com/user-attachments/assets/c2098d8e-e42d-4539-be5c-4a012f3e956e)
![Home page UI](https://github.com/user-attachments/assets/4c3f163d-0d01-41bb-80e3-590abee280d6)
![Screenshot 2025-03-31 151746](https://github.com/user-attachments/assets/c544e151-73ab-4573-b7bd-76b05c9e5d25)

- **Efficient State Management** – Reduces unnecessary computations.
- **Lightweight Storage** – Uses Local Storage for fast performance.

---

## 📂 Project Links

- **🔗 GitHub Repository:** [Repo Link](https://github.com/YOKESHWARANS/query-runner-webapp)  
- **🌐 Live Demo:** [Deployed App](https://query-runner-webapplication.vercel.app/)  
- **📊 Architecture Diagram:** [View Diagram](docs/system-architecture1.png)  
                                [View Diagram](docs/system-architecture2.png)
- **🗂️ ER Diagram:** [View ER Diagram](docs/er-diagram.png)  
                      [View ER Diagram](docs/er-diagram2.png)
- **📄 Technical Walkthrough PDF:** [Download PDF](https://drive.google.com/file/d/12fPWgMcEdlLF-rkq8YGWopol2-0QXRaj/view?usp=sharing)  
- **🎥 Video Walkthrough:** [Watch Video](https://drive.google.com/file/d/1gTF6YXjW7TkweK7Y1IgmDS8cQYccQ8LT/view?usp=sharing)  

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Material-UI, Recharts  
- **State Management:** React Hooks  
- **Storage:** Local Storage  
- **Performance Optimizations:** Lazy Loading, Memoization  
- **Error Handling:** Error Boundaries  

---

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/YOKESHWARANS/query-runner-webapp
cd sql-query-viewer
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Start the Development Server**
```bash
npm start
```

---



## 📈 Future Enhancements

- **Database Integration** for real SQL execution  
- **User Authentication** for personalized query storage  
- **Cloud Storage Support** for cross-device query access  

---

## 🏆 Credits & Contribution

Developed by **YOKESHWARAN S** as part of the Atlan Frontend Internship Task.  
Feel free to fork and improve this project! 😊  

📧 Contact Me:  
[Email](mailto:wsyokesh@gmail.com)  
[LinkedIn Profile](https://linkedin.com/in/yokeshwaran-s-38893825b/)

![Screenshot 2025-03-31 154546](https://github.com/user-attachments/assets/13d3f5ec-7a01-4188-aa32-7c7094d451e0)
![Screenshot 2025-03-31 151746](https://github.com/user-attachments/assets/38105370-e43f-4f1c-98e1-93b400099b8b)
