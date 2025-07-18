# YOLO Object Detection Web Application

This project is a web application that allows users to upload images and detect objects using a YOLO (You Only Look Once) model. The application processes the uploaded images, draws bounding boxes around detected objects, and returns the processed images to the user.

## Features

- User-friendly interface for uploading images.
- Real-time object detection using YOLO model.
- Display of processed images with bounding boxes and labels.
- Optional display of detection statistics, including the number and types of detected objects.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- Vite: A build tool that provides a fast development environment.
- Tailwind CSS: A utility-first CSS framework for styling.
- Ant Design: A design system for enterprise-level products.

## Project Structure

```
yolo-object-detection-app
├── public
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── placeholder.svg
│   ├── components
│   │   ├── ImageUploader.jsx
│   │   ├── DetectionResult.jsx
│   │   ├── LoadingIndicator.jsx
│   │   └── DetectionStats.jsx
│   ├── services
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd yolo-object-detection-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5050
   ```

## Usage

- Use the image upload form to select an image file from your device.
- Click the submit button to send the image to the server for processing.
- The processed image with detected objects will be displayed on the screen.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.