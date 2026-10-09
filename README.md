# FitForm AI 🏋️

**An AI-powered fitness assistant for real-time exercise tracking and repetition counting.**

FitForm AI uses computer vision and pose estimation to track body movements, count exercise repetitions, and help users monitor their workout sessions through a web application.

## ✨ Features

* **Real-Time Pose Detection:** Detects body landmarks using MediaPipe.
* **Automatic Rep Counting:** Tracks exercise movements and counts completed repetitions.
* **Live Visual Feedback:** Displays pose landmarks to help users monitor their movements.
* **Browser-Based Experience:** Runs through a web interface built with React.
* **Instant Updates:** Processes movement continuously while the camera is active.

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Build Tool:** Vite
* **Computer Vision:** MediaPipe Tasks Vision
* **Language:** JavaScript
* **Styling:** CSS
* **Development Tools:** npm, Git, GitHub

## ⚙️ Installation and Setup

### Prerequisites

* Node.js and npm
* Git
* A webcam
* A modern web browser

### 1. Clone the repository

```bash
git clone https://github.com/VGayathrireddy/FitForm-AI.git
```

### 2. Navigate to the project directory

```bash
cd FitForm-AI
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Open the local URL displayed in your terminal, usually:

`http://localhost:5173/`

Allow camera access when prompted.

## 🚀 How It Works

1. The application accesses the webcam with the user's permission.
2. MediaPipe detects body landmarks from the video frames.
3. The application tracks relevant body movements.
4. Exercise-specific logic identifies repetitions based on movement patterns.
5. The repetition counter updates as exercises are completed.

## 📂 Project Structure

```text
FitForm-AI/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 🔮 Future Improvements

* Support for multiple exercises, including squats, lunges, and push-ups.
* Exercise form analysis and movement feedback.
* Workout history and progress tracking.
* Personalized workout recommendations.
* Performance and pose-detection improvements.

## 🔒 Privacy

Camera access requires user permission. The application is designed for browser-based pose detection. Review the implementation before making claims about video storage or data transmission.

## 👩‍💻 Author

**Gayathri Reddy**

* GitHub: [VGayathrireddy](https://github.com/VGayathrireddy)

---

⭐ If you find this project interesting, consider starring the repository.
