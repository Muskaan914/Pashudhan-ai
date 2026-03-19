# Architecture and Implementation Plan for Pashudhan-AI

The project consists of three main components for a Cattle Breed Classification system. Currently, the directories and files are empty placeholders. Here is the proposed plan to build out the system.

## User Review Required

> [!IMPORTANT]
> Since the entire project is currently just empty files, we need to decide where to start. Please review the proposed architecture below and let me know if you agree. 
> Should we start by writing the AI model training code, building the Flutter mobile app UI, or setting up the Django backend?

## Proposed Changes

### AI Model (`ai_model/`)
- Write a script in `ai_model/src/train_model.py` to:
  - Load the cattle breed dataset from `ai_model/data/`.
  - Train a lightweight CNN (e.g., MobileNetV2) using TensorFlow/Keras.
  - Export the trained model as an `.h5` file and a `.tflite` file for mobile deployment.

### Mobile App (`mobile_app/`)
- Build a Flutter application (`lib/main.dart`, `camera_screen.dart`, etc.).
- Integrate the `camera` plugin to allow users to take pictures of cattle.
- Integrate `tflite_flutter` (or similar) to run the `lite_model.tflite` model directly on the device for fast, offline inference.
- Include a UI to intuitively display the predicted breed and confidence score.

### Backend API (`backend_api/` - Optional/Future)
- Setup Django REST Framework in `backend_api/animal_data/views.py`.
- Create models to store historical predictions, user data, or telemetry.
- Provide a fallback API endpoint for model inference if the mobile device cannot run it locally.

## Verification Plan

### Automated Tests
- **ML Model**: We will write `ai_model/src/evaluate_model.py` to evaluate the model on a test set and output accuracy, precision, and recall metrics.
- **Backend API**: Use Django's built-in testing (`python manage.py test`) for ensuring the API endpoints return appropriate JSON responses.

### Manual Verification
- We will compile and run the Flutter application to manually verify the camera UI and on-device inference using test images of cattle.
