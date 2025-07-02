# 🏙️ Civic Pulse

**Civic Pulse** is a citizen engagement platform that empowers users to report civic issues, track their resolution, and collaborate with the community to improve city infrastructure.

## 🚀 Features

- 📝 Report issues with descriptions, images, and location  
- 🔍 Track the status of submitted issues  
- 🛠 Admin dashboard to manage reported problems  
- 📊 Real-time stats on issues reported, resolved, and active users  
- 💬 Comment and get notified about updates  
- 👥 User authentication and role-based access  

## 🖥️ Tech Stack

- **Frontend:** React.js, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (with Mongoose or Prisma)  
- **Authentication:** JWT, Google Sign-In  
- **Deployment:** Vercel (Frontend), Render (Backend)  

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/civic-pulse.git
cd civic-pulse
```

### 2. Install Dependencies

```bash
cd client      # For frontend
npm install

cd ../server   # For backend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` folder and add the following:

```env
MONGO_URI=mongodb+srv://civic_user:civic123@cluster0.ncoex4m.mongodb.net/civic_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=swjashauirksfjvhfudkhdhn
```

### 4. Run the App

#### Frontend

```bash
cd client
npm start
```

#### Backend

```bash
cd server
node index.js
# or
nodemon index.js
```

## 🙌 Contributing

Feel free to fork the repository, make changes, and submit pull requests. All contributions are welcome!

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For any questions or feedback, feel free to reach out:  
**Swathi Ukkisila** – swathi76750@gmail.com  
GitHub: [swathiukkisila](https://github.com/swathiukkisila)