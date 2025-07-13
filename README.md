
# 🌾 AgriSmart - AI-Powered Plant Disease Detection & Advisory System



## 🚀 Overview

*AgriSmart* is an intelligent crop health assistant that helps farmers detect crop diseases, receive instant treatments, track history, and get personalized help via a smart chatbot — all through a mobile-first, multilingual platform.

Trained on the *PlantVillage dataset* using *Vision Transformer (ViT)* architecture, our model achieves *97.9% test accuracy* and delivers real-time disease classification, even in offline or rural environments.

---

## 🎯 Features

### 🔬 AI-Based Disease Detection
- Upload or capture leaf images to identify diseases using a fine-tuned ViT model.
- Achieves high accuracy on real-time predictions using PlantVillage dataset.
- Model inference works on web and mobile (Kaggle-trained & deployable).

### 💬 Smart Chatbot for Agricultural Guidance
- 🤖 *24/7 Virtual Assistant* for farmers to ask crop-related questions
- 💊 Suggests *fertilizers, pesticides, and organic treatments*
- 🛡 Advises on *preventive measures* to avoid future crop damage
- 🗣 Supports local languages for *regional farmer inclusivity*
- 🎯 Integrates with user dashboard for personalized answers

### 📈 Interactive Farmer Dashboard
- Visual insights on disease history and treatment effectiveness
- Tracks upload logs, predictions, and chatbot interactions
- Push notifications for seasonal tips and disease alerts

### 🕑 Disease Detection History
- Maintains timeline of all uploaded crop images and predictions
- Enables one-click revisit to previous treatment advice
- Helps in tracking recovery and re-infection patterns

---

## 🧠 Tech Stack

| Layer        | Tools / Libraries                                |
|--------------|--------------------------------------------------|
| Frontend     | ⚛ React.js, 🎨 Tailwind CSS, 🔁 React Router DOM |
| Backend      | 🚀 Express.js, 🍃 MongoDB, ☁ Cloudinary, 🧬 Mongoose |
| Machine Learning | 🧠 ViT (Vision Transformer), 🐍 PyTorch, 🤗 Transformers |
| Dataset      | 🌿 PlantVillage (41,000+ labeled images, 15 classes) |
| Chatbot      | 💬 Dialogflow / Rasa / GPT-based API integration |
| Extra Tools  | 🔥 Firebase (optional), ☁ Kaggle (GPU training), 📡 Hugging Face Hub |

---

## 📊 Model Performance

- *Model*: Vision Transformer google/vit-base-patch16-224-in21k
- *Accuracy*:
  - 🏋 Train: ~92%
  - 🧪 Validation: ~93%
  - 🧠 Test: ~97.9%
- *Dataset*: [PlantVillage on Kaggle](https://www.kaggle.com/datasets/emmarex/plantdisease)

---

## 🔮 Future Scope

- 🎙 *Voice Input & Output* for farmers with low literacy
- 🐛 *Pest and Weed Detection* using object detection models
- 📶 *Offline Inference* via on-device model loading (PWA)
- 📷 *Soil Health Detection* from camera-based leaf patterns
- 🛍 *Krishi Store Integration* for one-tap treatment purchases
- 🌍 *Language & Region Expansion* to other Indian and global regions
- 🧠 *AI Chatbot Enhancements*: Smart follow-up, feedback loop, and disease diagnosis via Q&A

---

## 🛠 How to Run Locally

1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/agrismart.git
   cd agrismart
   ```

2. Set up backend  
   ```bash
   cd backend
   npm install
   npm start
   ```

3. Set up frontend  
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. (Optional) Train ViT model using Kaggle Notebook or load pretrained weights.

---

> 🌱 *AgriSmart empowers every farmer with real-time crop intelligence, reducing losses, increasing yield, and enabling smarter agriculture for all.*
>
> here is the deploymennt link
   > https://stupendous-licorice-252de2.netlify.app
   > check it out 
