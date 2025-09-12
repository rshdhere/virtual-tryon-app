# Virtual Try-On App
A mobile app that lets users **virtually try on** clothes by uploading a model and garment image, generating a realistic preview to explore fashion choices before purchase.

# 📖 Introduction

This project is a **mobile application** that enables users to virtually try on clothing by uploading a model image and a garment image. The app uses **advanced visualization** techniques to generate a realistic preview of how the selected garment would look on the chosen model.

The goal is to provide users with an **interactive** and convenient way to explore fashion choices before making a purchase, reducing uncertainty in **online shopping** and enhancing the overall shopping experience.

## 🎥 Quick Demo
[![Watch the demo](https://img.youtube.com/vi/s_cGy05-u3Q/hqdefault.jpg)](https://youtube.com/shorts/s_cGy05-u3Q?feature=share)

## 🖥️ Demonstration on Indian Attire

<div align="center">
  <img src="assets/Original image.jpg" alt="Original image" 
  width="48%" height="500" style="margin-right: 3px;"/>
  <img src="assets/Generated image.png" alt="Generated image" width="48%" height="500" style="margin-left: 3px;"/>
</div>

# ✨ Features

- **Virtual Try-On** – Upload a model image and a garment image to generate a realistic outfit preview.

- **Garment Fit Visualization** – See how clothes drape, fit, and appear on different body types.

- **Multiple Outfit Testing** – Try on various garments quickly without physically changing clothes.

- **Realistic Rendering** – AI-based visualization for a more natural and lifelike look.

- **Interactive Experience** – Smooth and user-friendly interface for exploring different fashion styles.

- **Cross-Device Support** – Works seamlessly on mobile devices for on-the-go fashion exploration.

## 🚀 Tech Stack

### 🛠️ Backend
- Node.js
- Express.js
- **AWS S3** for image storage
- **RESTful API** architecture

### 🎨 Frontend
- React Native
- **Expo** framework
- **Expo Router** for routing

## 🏁 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- AWS Account (for S3 storage)

### 📦 Installation

#### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/rshdhere/virtual-tryon-app.git
   cd virtual-tryon-app/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=your_aws_region
   S3_BUCKET=your_s3_bucket_name
   ```

4. Start the backend server
   ```bash
   npm start
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd ../my-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with your backend API URL:
   ```
   API_URL=http://your_backend_api_url
   ```

4. Start the Expo development server
   ```bash
   expo start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code or run on an emulator


## 🔮 Features for future

- User profile management
- Favorites and recently viewed items
- Sharing functionality for social media
- Integration with popular e-commerce platforms

## 🏗️ Product Architecture

View app architecture and design diagrams on [Excalidraw](https://excalidraw.com/#json=O1KQ_5Pl47h6cMlGf56P8,M4zHHwGfHlf24BbVPdOOww).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## ⚖️ License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) - For the React Native framework
- [Express.js](https://expressjs.com/) - For the backend framework
