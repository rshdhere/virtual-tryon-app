# Virtual Try-On App

A mobile application that allows users to virtually try on clothing and accessories using augmented reality technology. This application provides a seamless shopping experience by enabling users to see how items would look on them before making a purchase.

## Product Architecture

View app architecture and design diagrams on [Excalidraw](https://excalidraw.com/#json=O1KQ_5Pl47h6cMlGf56P8,M4zHHwGfHlf24BbVPdOOww).


## Features

- Virtual try-on for clothing and accessories
- Realistic AR rendering with accurate sizing
- User profile management
- Favorites and recently viewed items
- Sharing functionality for social media
- Integration with popular e-commerce platforms

## Tech Stack

### Backend
- Node.js
- Express.js
- AWS S3 for image storage
- RESTful API architecture

### Frontend
- React Native
- Expo framework
- Expo Router for routing

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- AWS Account (for S3 storage)

### Installation

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
   cd ../frontend
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

## Usage

just a mvp


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) - For the React Native framework
- [Express.js](https://expressjs.com/) - For the backend framework
